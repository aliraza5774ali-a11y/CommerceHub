import { withTransaction } from '../../database/connection.js';
import { returnRepository } from './return.repository.js';
import { paymentRepository } from '../payments/payment.repository.js';
import { paymentService } from '../payments/payment.service.js';
import { AppError, assertFound } from '../../utils/errors.js';

export const returnService = {
  async create({ tenantId, userId, orderId, orderItemId, quantity, reason, customerNotes }) {
    return withTransaction(async (connection) => {
      const item = assertFound(await returnRepository.orderItem(orderId, orderItemId, tenantId, userId, connection), 'Order item not found');
      if (item.orderStatus !== 'DELIVERED') throw new AppError('Only delivered orders can be returned', 409, 'RETURN_NOT_ALLOWED');
      if (quantity > Number(item.orderedQuantity) || quantity <= 0) throw new AppError('Invalid return quantity', 422, 'INVALID_RETURN_QUANTITY');
      const refundAmount = Number((Number(item.unitPrice) * quantity).toFixed(2));
      return returnRepository.create({ orderId, orderItemId, quantity, reason, customerNotes, refundAmount }, tenantId, userId, connection);
    });
  },
  list: (tenantId, userId) => returnRepository.list(tenantId, userId),
  get: async (id, tenantId, userId) => assertFound(await returnRepository.find(id, tenantId, userId), 'Return not found'),
  async decide(id, tenantId, userId, decision, options = {}) { return withTransaction(async (connection) => { const item = assertFound(options.staff ? await returnRepository.findForStaff(id, tenantId, connection) : await returnRepository.find(id, tenantId, userId, connection), 'Return not found'); if (item.status !== 'REQUESTED') throw new AppError('Return has already been decided', 409, 'INVALID_RETURN_STATUS'); const changed = options.staff ? await returnRepository.updateStatusForStaff(id, tenantId, 'REQUESTED', decision, connection) : await returnRepository.updateStatus(id, tenantId, userId, 'REQUESTED', decision, connection); if (!changed) throw new AppError('Return changed, reload and retry', 409, 'CONFLICT'); return options.staff ? returnRepository.findForStaff(id, tenantId, connection) : returnRepository.find(id, tenantId, userId, connection); }); },
  async receive(id, tenantId, userId, options = {}) { const item = assertFound(options.staff ? await returnRepository.findForStaff(id, tenantId) : await returnRepository.find(id, tenantId, userId), 'Return not found'); if (item.status !== 'APPROVED') throw new AppError('Return must be approved before receipt', 409, 'INVALID_RETURN_STATUS'); if (options.staff) { await returnRepository.updateStatusForStaff(id, tenantId, 'APPROVED', 'RECEIVED'); await returnRepository.updateStatusForStaff(id, tenantId, 'RECEIVED', 'REFUND_PENDING'); } else { await returnRepository.updateStatus(id, tenantId, userId, 'APPROVED', 'RECEIVED'); await returnRepository.updateStatus(id, tenantId, userId, 'RECEIVED', 'REFUND_PENDING'); } const payment = assertFound(await paymentRepository.byOrder(item.orderId, tenantId, options.staff ? item.userId : userId), 'Payment not found'); await paymentService.refund(payment.id, tenantId, options.staff ? item.userId : userId, Number(item.refundAmount), { staff: options.staff }); await returnRepository.returnedInventory(item.orderItemId, tenantId, item.quantity); if (options.staff) await returnRepository.updateStatusForStaff(id, tenantId, 'REFUND_PENDING', 'REFUNDED'); else await returnRepository.updateStatus(id, tenantId, userId, 'REFUND_PENDING', 'REFUNDED'); return options.staff ? returnRepository.findForStaff(id, tenantId) : returnRepository.find(id, tenantId, userId); }
};
