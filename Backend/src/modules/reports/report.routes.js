import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { resolveTenantFromAuth } from '../../middleware/tenant.middleware.js';
import { requireStaff } from '../../middleware/authorize.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import { reportService } from './report.service.js';
export const reportRoutes = Router();
reportRoutes.use(authenticate, resolveTenantFromAuth, requireStaff);
for (const type of ['sales', 'orders', 'products', 'inventory', 'payments', 'returns', 'taxes']) { reportRoutes.get(`/${type}`, asyncHandler(async (req, res) => { const rows = await reportService.get(type, req.tenant.id, req.query); if (req.query.format === 'csv') { res.type('text/csv').send(reportService.csv(rows)); return; } success(res, rows); })); }
