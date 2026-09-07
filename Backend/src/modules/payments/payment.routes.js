import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth.middleware.js';
import { resolveTenantFromAuth } from '../../middleware/tenant.middleware.js';
import { requireStaff } from '../../middleware/authorize.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import { paymentService } from './payment.service.js';

export const paymentRoutes = Router();
paymentRoutes.use(authenticate, resolveTenantFromAuth);
paymentRoutes.get('/:id', asyncHandler(async (req, res) => success(res, await paymentService.get(req.params.id, req.tenant.id, req.auth.sub))));
paymentRoutes.post('/:id/confirm', asyncHandler(async (req, res) => success(res, await paymentService.confirm(req.params.id, req.tenant.id, req.auth.sub))));
paymentRoutes.post('/:id/refund', requireStaff, validate(z.object({ amount: z.coerce.number().positive() })), asyncHandler(async (req, res) => success(res, await paymentService.refund(req.params.id, req.tenant.id, req.auth.sub, req.body.amount, { staff: true }))));
