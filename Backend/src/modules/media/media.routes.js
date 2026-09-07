import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth.middleware.js';
import { resolveTenantFromAuth } from '../../middleware/tenant.middleware.js';
import { requireStaff } from '../../middleware/authorize.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import { mediaRepository } from './media.repository.js';

const schema = z.object({ fileName: z.string().min(1).max(255), fileUrl: z.string().url().max(1000), mimeType: z.string().min(3).max(120), fileSize: z.coerce.number().int().nonnegative(), altText: z.string().max(255).optional(), metadata: z.record(z.unknown()).optional() });
export const mediaRoutes = Router();
mediaRoutes.use(authenticate, resolveTenantFromAuth);
mediaRoutes.get('/', asyncHandler(async (req, res) => success(res, await mediaRepository.list(req.tenant.id))));
mediaRoutes.post('/', requireStaff, validate(schema), asyncHandler(async (req, res) => success(res, await mediaRepository.create(req.body, req.tenant.id, req.auth.sub), 201)));
mediaRoutes.delete('/:id', requireStaff, asyncHandler(async (req, res) => { if (!(await mediaRepository.remove(req.params.id, req.tenant.id))) return res.status(404).json({ success: false, message: 'Media not found', code: 'MEDIA_NOT_FOUND' }); return success(res, null); }));
