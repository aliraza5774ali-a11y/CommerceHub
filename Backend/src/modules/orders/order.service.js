import { withTransaction } from '../../database/connection.js';
import { cartRepository } from '../cart/cart.repository.js';
import { orderRepository } from './order.repository.js';
import { promotionRepository } from '../promotions/promotion.repository.js';
import { validatePromotion } from '../promotions/promotion.service.js';
import { taxService } from '../tax/tax.service.js';
import { shippingRepository } from '../shipping/shipping.repository.js';
import { AppError, assertFound } from '../../utils/errors.js';

const transitions = { PAYMENT_PENDING: ['PAID', 'CANCELLED'], PAID: ['PROCESSING', 'CANCELLED'], PROCESSING: ['SHIPPED'], SHIPPED: ['DELIVERED'], DELIVERED: ['RETURN_REQUESTED'], RETURN_REQUESTED: ['RETURNED'], RETURNED: ['REFUNDED'] };
function price(product) { return Number(product.salePrice ?? product.price); }
function idempotency(reqKey) { if (!reqKey || reqKey.length > 255) throw new AppError('Idempotency-Key header is required', 422, 'IDEMPOTENCY_KEY_REQUIRED'); return reqKey; }

export const orderService = {
  async checkout({ tenantId, userId, key, couponCode, paymentMethod = 'COD', currency = 'PKR', shippingMethodId }, dependencies = {}) {
    if (!key || key.length > 255) throw new AppError('Idempotency-Key header is required', 422, 'IDEMPOTENCY_KEY_REQUIRED');
    if (!['COD', 'CARD', 'BANK_TRANSFER', 'GATEWAY'].includes(paymentMethod)) throw new AppError('Unsupported payment method', 422, 'INVALID_PAYMENT_METHOD');
    const transaction = dependencies.transaction || withTransaction;
    const orders = dependencies.orderRepository || orderRepository;
    const carts = dependencies.cartRepository || cartRepository;
    const promotions = dependencies.promotionRepository || promotionRepository;
    const validateCoupon = dependencies.validatePromotion || validatePromotion;
    const taxes = dependencies.taxService || taxService;
    const shipping = dependencies.shippingRepository || shippingRepository;
    return transaction(async (connection) => {
      const prior = await orders.findByIdempotency(key, tenantId, userId, connection);
      if (prior) return { order: prior, items: await orders.items(prior.id, tenantId, connection), idempotent: true };
      const cart = await carts.findOrCreate(userId, tenantId, connection);
      const cartItems = await carts.items(cart.id, tenantId, connection);
      if (!cartItems.length) throw new AppError('Cart is empty', 422, 'CART_EMPTY');
      const lockedItems = [];
      for (const cartItem of cartItems) {
        const product = await orders.lockProduct(cartItem.productId, tenantId, connection);
        if (!product || product.status !== 'published') throw new AppError('A cart product is unavailable', 409, 'PRODUCT_UNAVAILABLE');
        const inventory = await orders.lockInventory(cartItem.productId, tenantId, connection);
        if (!inventory || Number(inventory.quantity) - Number(inventory.reservedQuantity) < Number(cartItem.quantity)) throw new AppError('Requested quantity is not available', 409, 'INSUFFICIENT_STOCK');
        const unitPrice = price(product);
        lockedItems.push({ cartItem, product, inventory, unitPrice, lineTotal: unitPrice * Number(cartItem.quantity) });
      }
      const subtotal = lockedItems.reduce((sum, item) => sum + item.lineTotal, 0);
      const { promotion, discount } = await validateCoupon({ code: couponCode || cart.couponCode, tenantId, userId, subtotal, connection, lock: true });
      const methods = shippingMethodId ? await shipping.methods(tenantId, connection) : [];
      const selectedMethod = shippingMethodId ? methods.find((method) => String(method.id) === String(shippingMethodId)) : null;
      if (shippingMethodId && !selectedMethod) throw new AppError('Shipping method not found', 404, 'SHIPPING_METHOD_NOT_FOUND');
      if (selectedMethod && ((selectedMethod.minimumOrder != null && subtotal < Number(selectedMethod.minimumOrder)) || (selectedMethod.maximumOrder != null && subtotal > Number(selectedMethod.maximumOrder)))) throw new AppError('Order does not qualify for this shipping method', 422, 'SHIPPING_RULE_NOT_MET');
      const shippingTotal = Number(selectedMethod?.fee || 0);
      const tax = await taxes.calculate(tenantId, Math.max(0, subtotal - discount + shippingTotal), connection);
      const total = Math.max(0, subtotal - discount + shippingTotal + tax);
      const order = await orders.create({ tenantId, userId, key, couponCode: promotion?.code, subtotal, discount, shipping: shippingTotal, tax, total, currency }, connection);
      for (const item of lockedItems) { const itemDiscount = Number((discount * item.lineTotal / subtotal).toFixed(2)); const itemTax = Number((tax * (item.lineTotal - itemDiscount) / Math.max(1, subtotal - discount)).toFixed(2)); await orders.addItem({ orderId: order.id, tenantId, productId: item.product.id, productName: item.product.name, sku: item.product.sku, quantity: item.cartItem.quantity, unitPrice: item.unitPrice, discount: itemDiscount, tax: itemTax, lineTotal: item.lineTotal - itemDiscount + itemTax }, connection); await orders.deductInventory(item.product.id, tenantId, item.cartItem.quantity, connection); }
      const payment = await orders.createPayment({ tenantId, orderId: order.id, userId, amount: total, method: paymentMethod, key: `${key}:payment` }, connection);
      if (promotion) { await promotions.createUsage({ promotionId: promotion.id, tenantId, userId, orderId: order.id }, connection); await promotions.incrementUsage(promotion.id, connection); }
      await orders.setCartConverted(cart.id, tenantId, connection);
      return { order, items: await orders.items(order.id, tenantId, connection), payment, idempotent: false };
    });
  },
  async list(tenantId, userId) { return orderRepository.list(tenantId, userId); },
  async get(id, tenantId, userId) { const order = assertFound(await orderRepository.findById(id, tenantId, userId), 'Order not found'); return { ...order, items: await orderRepository.items(order.id, tenantId) }; },
  async cancel(id, tenantId, userId) { return withTransaction(async (connection) => { const order = assertFound(await orderRepository.findById(id, tenantId, userId, connection), 'Order not found'); if (!['PENDING', 'PAYMENT_PENDING', 'PAID'].includes(order.status)) throw new AppError('Order cannot be cancelled in its current state', 409, 'INVALID_ORDER_STATUS'); const items = await orderRepository.items(order.id, tenantId, connection); for (const item of items) await orderRepository.restoreInventory(item.productId, tenantId, item.quantity, connection); if (!(await orderRepository.updateStatus(id, tenantId, userId, order.status, 'CANCELLED', connection))) throw new AppError('Order status changed', 409, 'CONFLICT'); return { ...(await orderRepository.findById(id, tenantId, userId, connection)), items: await orderRepository.items(id, tenantId, connection) }; }); },
  async transition(id, tenantId, userId, next) { return withTransaction(async (connection) => { const order = assertFound(await orderRepository.findById(id, tenantId, userId, connection), 'Order not found'); if (!transitions[order.status]?.includes(next)) throw new AppError('Invalid order status transition', 409, 'INVALID_ORDER_STATUS'); if (!(await orderRepository.updateStatus(id, tenantId, userId, order.status, next, connection))) throw new AppError('Order status changed', 409, 'CONFLICT'); return { ...await orderRepository.findById(id, tenantId, userId, connection), items: await orderRepository.items(id, tenantId, connection) }; }); }
};
