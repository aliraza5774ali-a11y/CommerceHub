import { taxRepository } from './tax.repository.js';
import { AppError } from '../../utils/errors.js';
export const taxService = {
  list: (tenantId) => taxRepository.list(tenantId),
  create: async (input, tenantId) => { if (input.taxType === 'percentage' && Number(input.rate) > 100) throw new AppError('Tax percentage cannot exceed 100', 422, 'INVALID_TAX_RATE'); return taxRepository.create(input, tenantId); },
  update: async (id, input, tenantId) => { const result = await taxRepository.update(id, input, tenantId); if (!result) throw new AppError('Tax rule changed or was not found', 409, 'TAX_RULE_NOT_FOUND'); return result; },
  async calculate(tenantId, taxableAmount, connection) { const rules = await taxRepository.active(tenantId, connection); return Number(rules.reduce((total, rule) => total + (rule.taxType === 'percentage' ? Number(taxableAmount) * Number(rule.rate) / 100 : Number(rule.rate)), 0).toFixed(2)); }
};
