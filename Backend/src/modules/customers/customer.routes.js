import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth.middleware.js';
import { resolveTenantFromAuth } from '../../middleware/tenant.middleware.js';
import { requireStaff } from '../../middleware/authorize.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import { pagination, pageResult } from '../../utils/pagination.js';
import { customerRepository } from './customer.repository.js';

export const customerRoutes = Router();
customerRoutes.use(authenticate, resolveTenantFromAuth, requireStaff);
customerRoutes.get('/', asyncHandler(async (req, res) => { const paging = pagination(req.query); const result = await customerRepository.list(req.tenant.id, { ...paging, search: req.query.search, status: req.query.status }); return success(res, pageResult(result.rows, result.total, paging)); }));
customerRoutes.get('/:id', asyncHandler(async (req, res) => success(res, await customerRepository.find(req.params.id, req.tenant.id))));
customerRoutes.patch('/:id', validate(z.object({ firstName: z.string().min(1).max(80).optional(), lastName: z.string().min(1).max(80).optional(), status: z.enum(['active', 'disabled']).optional() })), asyncHandler(async (req, res) => success(res, await customerRepository.update(req.params.id, req.tenant.id, req.body))));
customerRoutes.get('/:id/orders', asyncHandler(async (req, res) => success(res, await customerRepository.orders(req.params.id, req.tenant.id))));
customerRoutes.get('/:id/returns', asyncHandler(async (req, res) => success(res, await customerRepository.returns(req.params.id, req.tenant.id))));
customerRoutes.get('/:id/addresses', asyncHandler(async (req, res) => success(res, await customerRepository.addresses(req.params.id, req.tenant.id))));
