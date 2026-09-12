import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth.middleware.js';
import { resolveTenant, resolveTenantFromAuth } from '../../middleware/tenant.middleware.js';
import { requireStaff } from '../../middleware/authorize.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import { settingsService } from './settings.service.js';
import { THEME_PRESETS } from '../themes/theme.presets.js';
import { LAYOUT_TEMPLATES } from '../themes/layout.templates.js';

const jsonValue = z.record(z.unknown());
const settingsSchema = z.object({ version: z.coerce.number().int().nonnegative().optional(), storeName: z.string().max(160).optional(), storeDescription: z.string().max(5000).optional(), storeEmail: z.string().email().optional(), storePhone: z.string().max(40).optional(), currency: z.string().length(3).optional(), timezone: z.string().max(80).optional(), country: z.string().length(2).optional(), language: z.string().max(10).optional(), orderSettings: jsonValue.optional(), checkoutSettings: jsonValue.optional(), shippingSettings: jsonValue.optional(), returnSettings: jsonValue.optional(), notificationSettings: jsonValue.optional() });
const themeSchema = z.object({ version: z.coerce.number().int().nonnegative().optional(), templateId: z.enum(Object.keys(THEME_PRESETS)).optional(), primaryColor: z.string().max(20).optional(), secondaryColor: z.string().max(20).optional(), accentColor: z.string().max(20).optional(), backgroundColor: z.string().max(20).optional(), textColor: z.string().max(20).optional(), fontFamily: z.string().max(120).optional(), buttonStyle: z.string().max(40).optional(), borderRadius: z.string().max(20).optional() });
const layoutTemplateSchema = z.object({ layoutTemplate: z.enum(Object.keys(LAYOUT_TEMPLATES)) });

export const settingsRoutes = Router();

// Storefront-facing, no login required — this is what makes a template
// picked in Admin Settings actually reach the live site. Declared before the
// authenticate/resolveTenantFromAuth gate below so it isn't caught by it.
settingsRoutes.get('/theme/public', resolveTenant, asyncHandler(async (req, res) => {
  res.set('Cache-Control', 'no-store');
  return success(res, await settingsService.getPublicTheme(req.tenant.id));
}));

// Which full layout template (Classic/Editorial/...) the storefront should
// render — also public/no-login, for the same reason as theme/public above.
settingsRoutes.get('/template/public', resolveTenant, asyncHandler(async (req, res) => {
  res.set('Cache-Control', 'no-store');
  return success(res, await settingsService.getPublicLayoutTemplate(req.tenant.id));
}));

// The catalog of available layout templates (id/label/description/preview),
// for the signup picker, the admin switcher, and the first-login popup.
// Static and public — no tenant context needed.
settingsRoutes.get('/layout-templates', asyncHandler(async (req, res) => success(res, settingsService.getLayoutTemplates())));

settingsRoutes.use(authenticate, resolveTenantFromAuth);
settingsRoutes.get('/', asyncHandler(async (req, res) => success(res, await settingsService.get(req.tenant.id))));
settingsRoutes.patch('/', requireStaff, validate(settingsSchema), asyncHandler(async (req, res) => success(res, await settingsService.update(req.tenant.id, req.auth.sub, req.body))));
settingsRoutes.patch('/theme', requireStaff, validate(themeSchema), asyncHandler(async (req, res) => success(res, await settingsService.updateTheme(req.tenant.id, req.auth.sub, req.body))));
settingsRoutes.patch('/layout-template', requireStaff, validate(layoutTemplateSchema), asyncHandler(async (req, res) => success(res, await settingsService.updateLayoutTemplate(req.tenant.id, req.auth.sub, req.body))));
