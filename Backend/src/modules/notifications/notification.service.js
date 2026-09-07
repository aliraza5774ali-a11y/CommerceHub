import { notificationRepository } from './notification.repository.js';
export class EmailProvider { async send() { return { delivered: false, reason: 'EMAIL_PROVIDER_NOT_CONFIGURED' }; } }
export const notificationService = {
  create: (input) => notificationRepository.create(input),
  async list(tenantId, userId, paging) { const result = await notificationRepository.list(tenantId, userId, paging); return { data: result.rows, unread: result.unread, pagination: { page: paging.page, limit: paging.limit, total: result.total, totalPages: Math.ceil(result.total / paging.limit) } }; },
  read: (id, tenantId, userId) => notificationRepository.read(id, tenantId, userId),
  readAll: (tenantId, userId) => notificationRepository.readAll(tenantId, userId)
};
