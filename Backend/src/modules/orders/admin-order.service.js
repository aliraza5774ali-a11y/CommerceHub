import { withTransaction } from '../../database/connection.js';
import { adminOrderRepository } from './admin-order.repository.js';
import { AppError, assertFound } from '../../utils/errors.js';
const transitions = { PAYMENT_PENDING: ['PAID', 'CANCELLED'], PAID: ['PROCESSING', 'CANCELLED'], PROCESSING: ['SHIPPED'], SHIPPED: ['DELIVERED'], DELIVERED: ['RETURN_REQUESTED'], RETURN_REQUESTED: ['RETURNED'], RETURNED: ['REFUNDED'] };
export const adminOrderService = {
  async list(tenantId) { return adminOrderRepository.list(tenantId); },
  async get(id, tenantId) { const order = assertFound(await adminOrderRepository.find(id, tenantId), 'Order not found'); return { ...order, items: await adminOrderRepository.items(id, tenantId), timeline: await adminOrderRepository.timeline(id, tenantId) }; },
  async status(id, tenantId, actorId, next) { return withTransaction(async (connection) => { const order = assertFound(await adminOrderRepository.find(id, tenantId, connection), 'Order not found'); if (!transitions[order.status]?.includes(next)) throw new AppError('Invalid order status transition', 409, 'INVALID_ORDER_STATUS'); if (!(await adminOrderRepository.updateStatus(id, tenantId, order.status, next, actorId, connection))) throw new AppError('Order changed, reload and retry', 409, 'CONFLICT'); const updated = await adminOrderRepository.find(id, tenantId, connection); return { ...updated, items: await adminOrderRepository.items(id, tenantId, connection), timeline: await adminOrderRepository.timeline(id, tenantId, connection) }; }); },
  async note(id, tenantId, actorId, note) { assertFound(await adminOrderRepository.find(id, tenantId), 'Order not found'); return adminOrderRepository.addNote(id, tenantId, actorId, note); },
  async timeline(id, tenantId) { assertFound(await adminOrderRepository.find(id, tenantId), 'Order not found'); return adminOrderRepository.timeline(id, tenantId); }
};
