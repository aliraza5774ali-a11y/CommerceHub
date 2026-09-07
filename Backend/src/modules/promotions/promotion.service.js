import { promotionRepository } from './promotion.repository.js';
import { AppError } from '../../utils/errors.js';

export function calculateDiscount(promotion, subtotal) {
  let discount = promotion.type === 'percentage' ? subtotal * (Number(promotion.value) / 100) : Number(promotion.value);
  if (promotion.maximumDiscount != null) discount = Math.min(discount, Number(promotion.maximumDiscount));
  return Math.max(0, Math.min(Number(subtotal), Number(discount.toFixed(2))));
}
export async function validatePromotion({ code, tenantId, userId, subtotal, connection, lock = false }) {
  if (!code) return { promotion: null, discount: 0 };
  const promotion = await promotionRepository.findByCode(code.trim().toUpperCase(), tenantId, connection, lock);
  if (!promotion || !promotion.active) throw new AppError('Coupon is invalid or inactive', 422, 'INVALID_COUPON');
  const now = Date.now();
  if ((promotion.startsAt && new Date(promotion.startsAt).getTime() > now) || (promotion.endsAt && new Date(promotion.endsAt).getTime() < now)) throw new AppError('Coupon has expired or is not active yet', 422, 'PROMOTION_EXPIRED');
  if (promotion.usageLimit != null && Number(promotion.usageCount) >= Number(promotion.usageLimit)) throw new AppError('Coupon usage limit has been reached', 422, 'PROMOTION_LIMIT_REACHED');
  const used = await promotionRepository.customerUsage(promotion.id, userId, connection, lock);
  if (promotion.perCustomerLimit != null && used >= Number(promotion.perCustomerLimit)) throw new AppError('You have reached this coupon usage limit', 422, 'CUSTOMER_PROMOTION_LIMIT_REACHED');
  if (Number(subtotal) < Number(promotion.minimumOrderAmount)) throw new AppError(`Minimum order amount is ${promotion.minimumOrderAmount}`, 422, 'MINIMUM_ORDER_NOT_MET');
  return { promotion, discount: calculateDiscount(promotion, subtotal) };
}

export const promotionService = { validate: validatePromotion, async create(input, tenantId) { if (input.type === 'percentage' && Number(input.value) > 100) throw new AppError('Percentage cannot exceed 100', 422, 'INVALID_PROMOTION'); return promotionRepository.create(input, tenantId); } };
