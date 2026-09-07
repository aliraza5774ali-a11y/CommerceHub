import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { resolveTenantFromAuth } from '../../middleware/tenant.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';

export const tenantRoutes = Router();
tenantRoutes.get('/me', authenticate, resolveTenantFromAuth, asyncHandler(async (req, res) => success(res, req.tenant)));
