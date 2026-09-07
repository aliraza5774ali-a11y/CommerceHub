import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth.middleware.js';
import { resolveTenantFromAuth } from '../../middleware/tenant.middleware.js';
import { requireStaff } from '../../middleware/authorize.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import { settingsService } from './settings.service.js';

const jsonValue = z.record(z.unknown());
const settingsSchema = z.object({ version: z.coerce.number().int().nonnegative().optional(), storeName: z.string().max(160).optional(), storeDescription: z.string().max(5000).optional(), storeEmail: z.string().email().optional(), storePhone: z.string().max(40).optional(), currency: z.string().length(3).optional(), timezone: z.string().max(80).optional(), country: z.string().length(2).optional(), language: z.string().max(10).optional(), orderSettings: jsonValue.optional(), checkoutSettings: jsonValue.optional(), shippingSettings: jsonValue.optional(), returnSettings: jsonValue.optional(), notificationSettings: jsonValue.optional() });
const themeSchema = z.object({ version: z.coerce.number().int().nonnegative().optional(), primaryColor: z.string().max(20).optional(), secondaryColor: z.string().max(20).optional(), accentColor: z.string().max(20).optional(), backgroundColor: z.string().max(20).optional(), textColor: z.string().max(20).optional(), fontFamily: z.string().max(120).optional(), buttonStyle: z.string().max(40).optional(), borderRadius: z.string().max(20).optional() });
export const settingsRoutes = Router();
settingsRoutes.use(authenticate, resolveTenantFromAuth);
settingsRoutes.get('/', asyncHandler(async (req, res) => success(res, await settingsService.get(req.tenant.id))));
settingsRoutes.patch('/', requireStaff, validate(settingsSchema), asyncHandler(async (req, res) => success(res, await settingsService.update(req.tenant.id, req.auth.sub, req.body))));
settingsRoutes.patch('/theme', requireStaff, validate(themeSchema), asyncHandler(async (req, res) => success(res, await settingsService.updateTheme(req.tenant.id, req.auth.sub, req.body))));
