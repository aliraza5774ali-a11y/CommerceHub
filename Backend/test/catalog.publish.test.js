import test from 'node:test';
import assert from 'node:assert/strict';
import { catalogService } from '../src/modules/catalog/catalog.service.js';

function publishableProduct(overrides = {}) {
  return { id: 1, name: 'Classic Black T-Shirt', slug: 'classic-black-t-shirt', description: null, price: 2500, salePrice: null, sku: 'TSHIRT-BLK', status: 'draft', version: 1, ...overrides };
}

function publishHarness({ product = publishableProduct(), inventory = null, failInitialize = false } = {}) {
  const state = { product, inventory, commits: 0, rollbacks: 0, initializeCalls: 0 };
  const transaction = async (work) => {
    const before = structuredClone({ product: state.product, inventory: state.inventory });
    try {
      const result = await work({});
      state.commits += 1;
      return result;
    } catch (error) {
      state.product = before.product;
      state.inventory = before.inventory;
      state.rollbacks += 1;
      throw error;
    }
  };
  const catalogRepository = {
    async findByIdForUpdate(id, tenantId) {
      return tenantId === 10 && String(id) === String(state.product?.id) ? { ...state.product } : null;
    },
    async publish(id, tenantId) {
      if (tenantId !== 10 || state.product?.status !== 'draft') return null;
      state.product = { ...state.product, status: 'published', version: state.product.version + 1 };
      return { ...state.product };
    }
  };
  const inventoryRepository = {
    async initialize(productId, tenantId) {
      state.initializeCalls += 1;
      if (failInitialize) throw new Error('Inventory insert failed');
      state.inventory ??= { productId: Number(productId), quantity: 0, reservedQuantity: 0, version: 1, tenantId };
      return { ...state.inventory };
    }
  };
  return { state, dependencies: { transaction, catalogRepository, inventoryRepository } };
}

test('a draft product publishes and initializes zero inventory', async () => {
  const { state, dependencies } = publishHarness();
  const result = await catalogService.publish({ productId: 1, tenantId: 10 }, dependencies);

  assert.equal(result.product.status, 'published');
  assert.equal(result.product.version, 2);
  assert.deepEqual(result.inventory, { productId: 1, quantity: 0, reservedQuantity: 0, version: 1, tenantId: 10 });
  assert.equal(state.initializeCalls, 1);
  assert.equal(state.commits, 1);
});

test('publishing preserves an already initialized inventory record without creating a duplicate', async () => {
  const existingInventory = { productId: 1, quantity: 7, reservedQuantity: 2, version: 4, tenantId: 10 };
  const { state, dependencies } = publishHarness({ inventory: existingInventory });
  const result = await catalogService.publish({ productId: 1, tenantId: 10 }, dependencies);

  assert.deepEqual(result.inventory, existingInventory);
  assert.deepEqual(state.inventory, existingInventory);
});

test('a published product cannot be published again', async () => {
  const { dependencies } = publishHarness({ product: publishableProduct({ status: 'published', version: 2 }) });
  await assert.rejects(() => catalogService.publish({ productId: 1, tenantId: 10 }, dependencies), { code: 'INVALID_PRODUCT_STATUS', statusCode: 409 });
});

test('a product in another tenant cannot be published', async () => {
  const { dependencies } = publishHarness();
  await assert.rejects(() => catalogService.publish({ productId: 1, tenantId: 99 }, dependencies), { code: 'NOT_FOUND', statusCode: 404 });
});

test('a failed inventory initialization rolls back product publication', async () => {
  const { state, dependencies } = publishHarness({ failInitialize: true });
  await assert.rejects(() => catalogService.publish({ productId: 1, tenantId: 10 }, dependencies), /Inventory insert failed/);

  assert.equal(state.product.status, 'draft');
  assert.equal(state.product.version, 1);
  assert.equal(state.inventory, null);
  assert.equal(state.commits, 0);
  assert.equal(state.rollbacks, 1);
});
