import test from 'node:test';
import assert from 'node:assert/strict';
import { orderService } from '../src/modules/orders/order.service.js';

function checkoutHarness({ failPayment = false } = {}) {
  const state = {
    inventory: {
      '10:3': { productId: 3, tenantId: 10, quantity: 10, reservedQuantity: 0, version: 1 },
      '20:3': { productId: 3, tenantId: 20, quantity: 40, reservedQuantity: 0, version: 1 }
    },
    cartItems: [{ id: 1, productId: 3, quantity: 2 }],
    orders: [], items: [], payments: [], movements: [], commits: 0, rollbacks: 0, locks: [], cartStatus: 'active', cartConversions: 0
  };
  const transaction = async (work) => {
    const before = structuredClone(state);
    try { const result = await work({}); state.commits += 1; return result; }
    catch (error) { Object.assign(state, before); state.rollbacks += 1; throw error; }
  };
  const orderRepository = {
    async findByIdempotency(key, tenantId, userId) { return state.orders.find((order) => order.key === key && order.tenantId === tenantId && order.userId === userId) || null; },
    async items(orderId) { return state.items.filter((item) => item.orderId === orderId); },
    async lockProduct(productId, tenantId) { return productId === 3 && tenantId === 10 ? { id: 3, name: 'Zee perfume', sku: 'ZEE-3', price: 100, salePrice: null, status: 'published' } : null; },
    async lockInventory(productId, tenantId) { state.locks.push({ productId, tenantId }); const inventory = state.inventory[`${tenantId}:${productId}`]; return inventory && { ...inventory }; },
    async create({ tenantId, userId, key }) { const order = { id: state.orders.length + 1, tenantId, userId, key, status: 'PAYMENT_PENDING' }; state.orders.push(order); return order; },
    async addItem(item) { state.items.push(item); },
    async deductInventory(productId, tenantId, quantity) { const inventory = state.inventory[`${tenantId}:${productId}`]; if (!inventory || inventory.quantity < quantity) { const error = new Error('Requested quantity is not available'); error.statusCode = 409; error.code = 'INSUFFICIENT_STOCK'; throw error; } inventory.quantity -= quantity; inventory.version += 1; state.movements.push({ tenantId, productId, delta: -quantity }); },
    async createPayment({ tenantId, orderId, userId }) { if (failPayment) throw new Error('Payment insert failed'); const payment = { id: state.payments.length + 1, tenantId, orderId, userId, status: 'PENDING' }; state.payments.push(payment); return payment; },
    async setCartConverted() { state.cartStatus = 'converted'; state.cartConversions += 1; }
  };
  const cartRepository = {
    async findOrCreate() { return { id: 1, couponCode: null }; },
    async items() { return state.cartItems.map((item) => ({ ...item })); }
  };
  const dependencies = {
    transaction, orderRepository, cartRepository,
    promotionRepository: { async createUsage() {}, async incrementUsage() {} },
    validatePromotion: async () => ({ promotion: null, discount: 0 }),
    taxService: { async calculate() { return 0; } }
  };
  return { state, dependencies };
}

test('checkout deducts tenant inventory and leaves reserved quantity at zero', async () => {
  const { state, dependencies } = checkoutHarness();
  await orderService.checkout({ tenantId: 10, userId: 7, key: 'zee-checkout-1' }, dependencies);

  assert.deepEqual(state.inventory['10:3'], { productId: 3, tenantId: 10, quantity: 8, reservedQuantity: 0, version: 2 });
  assert.deepEqual(state.inventory['20:3'], { productId: 3, tenantId: 20, quantity: 40, reservedQuantity: 0, version: 1 });
  assert.deepEqual(state.locks, [{ productId: 3, tenantId: 10 }]);
  assert.deepEqual(state.movements, [{ tenantId: 10, productId: 3, delta: -2 }]);
});

test('an insufficient second checkout does not change either tenant inventory', async () => {
  const { state, dependencies } = checkoutHarness();
  await orderService.checkout({ tenantId: 10, userId: 7, key: 'zee-checkout-1' }, dependencies);
  state.cartItems = [{ id: 2, productId: 3, quantity: 9 }];

  await assert.rejects(() => orderService.checkout({ tenantId: 10, userId: 7, key: 'zee-checkout-2' }, dependencies), { code: 'INSUFFICIENT_STOCK', statusCode: 409 });
  assert.equal(state.inventory['10:3'].quantity, 8);
  assert.equal(state.inventory['10:3'].reservedQuantity, 0);
  assert.equal(state.inventory['20:3'].quantity, 40);
});

test('a later checkout failure rolls back its inventory deduction', async () => {
  const { state, dependencies } = checkoutHarness({ failPayment: true });
  await assert.rejects(() => orderService.checkout({ tenantId: 10, userId: 7, key: 'zee-checkout-failure' }, dependencies), /Payment insert failed/);

  assert.equal(state.inventory['10:3'].quantity, 10);
  assert.equal(state.inventory['10:3'].reservedQuantity, 0);
  assert.equal(state.orders.length, 0);
  assert.equal(state.movements.length, 0);
  assert.equal(state.commits, 0);
  assert.equal(state.rollbacks, 1);
});

test('a repeated idempotency key returns the original order without converting another cart', async () => {
  const { state, dependencies } = checkoutHarness();
  const first = await orderService.checkout({ tenantId: 10, userId: 7, key: 'zee-cart-2-2' }, dependencies);
  const second = await orderService.checkout({ tenantId: 10, userId: 7, key: 'zee-cart-2-2' }, dependencies);

  assert.equal(first.idempotent, false);
  assert.equal(second.idempotent, true);
  assert.equal(state.orders.length, 1);
  assert.equal(state.cartStatus, 'converted');
  assert.equal(state.cartConversions, 1);
  assert.equal(state.inventory['10:3'].quantity, 8);
});
