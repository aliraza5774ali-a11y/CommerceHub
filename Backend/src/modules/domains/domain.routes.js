import { Router } from 'express';
import { resolveTenant } from '../../middleware/tenant.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { resolveTenantFromAuth } from '../../middleware/tenant.middleware.js';
import { requireStaff } from '../../middleware/authorize.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { domainRepository } from './domain.repository.js';
import { withTransaction } from '../../database/connection.js';
import { z } from 'zod';
import { success } from '../../utils/apiResponse.js';

export const domainRoutes = Router();
domainRoutes.get('/resolve', resolveTenant, (req, res) => {
  res.set('Cache-Control', 'no-store');
  success(res, req.tenant);
});
domainRoutes.get('/', authenticate, resolveTenantFromAuth, requireStaff, asyncHandler(async (req, res) => success(res, await domainRepository.list(req.tenant.id))));
domainRoutes.post('/', authenticate, resolveTenantFromAuth, requireStaff, validate(z.object({ host: z.string().min(3).max(255), domainType: z.enum(['subdomain', 'custom']) })), asyncHandler(async (req, res) => success(res, await domainRepository.createDomain({ tenantId: req.tenant.id, ...req.body }), 201)));
domainRoutes.patch('/:id/primary', authenticate, resolveTenantFromAuth, requireStaff, asyncHandler(async (req, res) => success(res, await withTransaction((connection) => domainRepository.setPrimary(req.params.id, req.tenant.id, connection)))));
domainRoutes.post('/:id/verify', authenticate, resolveTenantFromAuth, requireStaff, validate(z.object({ token: z.string().length(64) })), asyncHandler(async (req, res) => success(res, await domainRepository.verify(req.params.id, req.tenant.id, req.body.token))));
domainRoutes.delete('/:id', authenticate, resolveTenantFromAuth, requireStaff, asyncHandler(async (req, res) => { if (!(await domainRepository.deleteDomain(req.params.id, req.tenant.id))) return res.status(409).json({ success: false, message: 'Primary domains cannot be deleted', code: 'PRIMARY_DOMAIN_CONFLICT' }); return success(res, null); }));
