import test from 'node:test';
import assert from 'node:assert/strict';
import { shippingService } from '../src/modules/shipping/shipping.service.js';

function transitionHarness({ failOrderUpdate = false } = {}) {
  const state = {
    shipment: { id: 30, orderId: 20, status: 'PENDING', version: 1 },
    order: { id: 20, status: 'PAID' },
    payment: { orderId: 20, status: 'PAID' },
    commits: 0,
    rollbacks: 0
  };
  const transaction = async (work) => {
    const before = structuredClone({ shipment: state.shipment, order: state.order, payment: state.payment });
    try {
      const result = await work({});
      state.commits += 1;
      return result;
    } catch (error) {
      state.shipment = before.shipment;
      state.order = before.order;
      state.payment = before.payment;
      state.rollbacks += 1;
      throw error;
    }
  };
  const shippingRepository = {
    async shipmentForUpdate(id, tenantId, userId) {
      return id === 30 && tenantId === 10 && userId === 5 ? { ...state.shipment } : null;
    },
    async updateStatus(id, tenantId, userId, from, to, version) {
      if (id !== 30 || tenantId !== 10 || userId !== 5 || state.shipment.status !== from || state.shipment.version !== version) return false;
      state.shipment = { ...state.shipment, status: to, version: version + 1 };
      return true;
    },
    async orderForUpdate(id, tenantId, userId) {
      return id === 20 && tenantId === 10 && userId === 5 ? { ...state.order } : null;
    },
    async markOrderDelivered(id, tenantId, userId, from) {
      if (failOrderUpdate || id !== 20 || tenantId !== 10 || userId !== 5 || state.order.status !== from) return false;
      state.order = { ...state.order, status: 'DELIVERED' };
      return true;
    },
    async shipment() { return { ...state.shipment }; }
  };
  return { state, dependencies: { transaction, shippingRepository } };
}

test('delivering a shipment marks its paid order delivered without changing payment', async () => {
  const { state, dependencies } = transitionHarness();
  let version = state.shipment.version;
  for (const status of ['PROCESSING', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED']) {
    const shipment = await shippingService.transition(30, 10, 5, status, version, undefined, dependencies);
    version = shipment.version;
  }

  assert.equal(state.shipment.status, 'DELIVERED');
  assert.equal(state.order.status, 'DELIVERED');
  assert.equal(state.payment.status, 'PAID');
  assert.equal(state.commits, 5);
  assert.equal(state.rollbacks, 0);
});

test('an order update failure rolls back the delivered shipment transition', async () => {
  const { state, dependencies } = transitionHarness({ failOrderUpdate: true });
  state.shipment = { ...state.shipment, status: 'OUT_FOR_DELIVERY', version: 5 };

  await assert.rejects(() => shippingService.transition(30, 10, 5, 'DELIVERED', 5, undefined, dependencies), { code: 'CONFLICT', statusCode: 409 });
  assert.deepEqual(state.shipment, { id: 30, orderId: 20, status: 'OUT_FOR_DELIVERY', version: 5 });
  assert.deepEqual(state.order, { id: 20, status: 'PAID' });
  assert.deepEqual(state.payment, { orderId: 20, status: 'PAID' });
  assert.equal(state.commits, 0);
  assert.equal(state.rollbacks, 1);
});
