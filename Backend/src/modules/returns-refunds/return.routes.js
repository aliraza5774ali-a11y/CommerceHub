import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth.middleware.js';
import { resolveTenantFromAuth } from '../../middleware/tenant.middleware.js';
import { requireStaff } from '../../middleware/authorize.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import { returnService } from './return.service.js';

export const returnRoutes = Router();
returnRoutes.use(authenticate, resolveTenantFromAuth);
returnRoutes.post('/orders/:orderId/returns', validate(z.object({ orderItemId: z.coerce.number().int().positive(), quantity: z.coerce.number().int().positive(), reason: z.string().min(2).max(255), customerNotes: z.string().max(2000).optional() })), asyncHandler(async (req, res) => success(res, await returnService.create({ ...req.body, orderId: req.params.orderId, tenantId: req.tenant.id, userId: req.auth.sub }), 201)));
returnRoutes.get('/', asyncHandler(async (req, res) => success(res, await returnService.list(req.tenant.id, req.auth.sub))));
returnRoutes.get('/:id', asyncHandler(async (req, res) => success(res, await returnService.get(req.params.id, req.tenant.id, req.auth.sub))));
returnRoutes.patch('/:id/approve', requireStaff, asyncHandler(async (req, res) => success(res, await returnService.decide(req.params.id, req.tenant.id, req.auth.sub, 'APPROVED', { staff: true }))));
returnRoutes.patch('/:id/reject', requireStaff, asyncHandler(async (req, res) => success(res, await returnService.decide(req.params.id, req.tenant.id, req.auth.sub, 'REJECTED', { staff: true }))));
returnRoutes.patch('/:id/received', requireStaff, asyncHandler(async (req, res) => success(res, await returnService.receive(req.params.id, req.tenant.id, req.auth.sub, { staff: true }))));
