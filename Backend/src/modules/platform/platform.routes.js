import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requirePlatformAdmin } from '../../middleware/platform.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import { tenantRepository } from '../tenants/tenant.repository.js';
import { recordAudit } from '../../utils/audit.js';
import { withTransaction } from '../../database/connection.js';
import { AppError, assertFound } from '../../utils/errors.js';

const transitions = { pending: ['active', 'suspended'], active: ['suspended', 'closed'], suspended: ['active', 'closed'], closed: [] };
export const platformRoutes = Router();
platformRoutes.use(authenticate, requirePlatformAdmin);
platformRoutes.get('/tenants', asyncHandler(async (req, res) => success(res, await tenantRepository.list())));
platformRoutes.get('/tenants/:id', asyncHandler(async (req, res) => success(res, assertFound(await tenantRepository.findById(req.params.id), 'Tenant not found'))));
platformRoutes.patch('/tenants/:id/status', validate(z.object({ status: z.enum(['active', 'suspended', 'pending', 'closed']) })), asyncHandler(async (req, res) => withTransaction(async (connection) => { const tenant = assertFound(await tenantRepository.findById(req.params.id, connection), 'Tenant not found'); if (!transitions[tenant.status]?.includes(req.body.status)) throw new AppError('Invalid tenant status transition', 409, 'INVALID_TENANT_STATUS'); const updated = await tenantRepository.updateStatus(req.params.id, req.body.status, connection); await recordAudit({ tenantId: tenant.id, userId: req.auth.sub, action: 'TENANT_STATUS_CHANGED', resourceType: 'tenant', resourceId: tenant.id, metadata: { from: tenant.status, to: req.body.status }, connection }); return success(res, updated); })));
