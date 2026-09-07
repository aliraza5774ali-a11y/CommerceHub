import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth.middleware.js';
import { resolveTenantFromAuth } from '../../middleware/tenant.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import { orderService } from './order.service.js';

export const orderRoutes = Router();
orderRoutes.use(authenticate, resolveTenantFromAuth);
orderRoutes.post('/', validate(z.object({ couponCode: z.string().max(80).optional(), paymentMethod: z.enum(['COD', 'CARD', 'BANK_TRANSFER', 'GATEWAY']).default('COD'), currency: z.string().length(3).default('PKR'), shippingMethodId: z.coerce.number().int().positive().optional() })), asyncHandler(async (req, res) => success(res, await orderService.checkout({ tenantId: req.tenant.id, userId: req.auth.sub, key: req.get('idempotency-key'), ...req.body }), 201)));
orderRoutes.get('/', asyncHandler(async (req, res) => success(res, await orderService.list(req.tenant.id, req.auth.sub))));
orderRoutes.get('/:id', asyncHandler(async (req, res) => success(res, await orderService.get(req.params.id, req.tenant.id, req.auth.sub))));
orderRoutes.patch('/:id/cancel', asyncHandler(async (req, res) => success(res, await orderService.cancel(req.params.id, req.tenant.id, req.auth.sub))));
