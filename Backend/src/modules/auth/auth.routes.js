import { Router } from 'express';
import { z } from 'zod';
import { authService } from './auth.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import { validate } from '../../middleware/validation.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { resolveTenant } from '../../middleware/tenant.middleware.js';
import { THEME_OPTIONS } from '../themes/theme.presets.js';

const registerNewStoreSchema = z.object({
  storeName: z.string().trim().min(2).max(120),
  storeSlug: z.string().regex(/^[a-z0-9-]+$/).min(2).max(60),
  email: z.string().email().transform((value) => value.toLowerCase()),
  phone: z.string().trim().min(6).max(30),
  password: z.string().min(8).max(128),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  niche: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80),
  themeId: z.string().trim().min(2).max(40).optional(),
  customDomain: z
    .string()
    .trim()
    .toLowerCase()
    .min(4)
    .max(255)
    .regex(/^(?!https?:\/\/)[a-z0-9-]+(\.[a-z0-9-]+)+$/, 'Enter a domain like yourbrand.com, without http:// or www')
    .optional()
});
const registerCustomerSchema = z.object({ email: z.string().email().transform((value) => value.toLowerCase()), password: z.string().min(8).max(128), firstName: z.string().trim().min(1).max(80), lastName: z.string().trim().min(1).max(80) });

const loginSchema = z.object({ email: z.string().email().transform((value) => value.toLowerCase()), password: z.string().min(1) });
const selectBusinessSchema = z.object({ loginTicket: z.string().min(10), businessId: z.union([z.string(), z.number()]) });
const verifyTwoFactorSchema = z.object({ loginTicket: z.string().min(10), code: z.string().length(6) });

export const authRoutes = Router();

const optionalTenant = (req, res, next) => {
  resolveTenant(req, res, (err) => {
    if (err && err.code === 'TENANT_NOT_FOUND') {
      return next();
    }
    next(err);
  });
};

const dynamicRegisterValidation = (req, res, next) => {
  if (req.tenant) {
    return validate(registerCustomerSchema)(req, res, next);
  }
  return validate(registerNewStoreSchema)(req, res, next);
};

authRoutes.get('/theme-options', (req, res) => success(res, THEME_OPTIONS));
authRoutes.post('/register', optionalTenant, dynamicRegisterValidation, asyncHandler(async (req, res) => success(res, await authService.register(req.body, req.tenant), 201)));
// A store login must be scoped to the resolved store.  This is especially
// important in development where the SPA calls the API host and supplies the
// storefront host through the supported `domain` query parameter.
authRoutes.post('/login', optionalTenant, validate(loginSchema), asyncHandler(async (req, res) => success(res, await authService.login(req.body, req.tenant))));
// Platform-domain business login follow-up steps: pick a business when the
// same email owns/staffs more than one, then verify 2FA if the account has it
// enabled. Both take the short-lived loginTicket returned by /login.
authRoutes.post('/select-business', validate(selectBusinessSchema), asyncHandler(async (req, res) => success(res, await authService.selectBusiness(req.body.loginTicket, req.body.businessId))));
authRoutes.post('/verify-2fa', validate(verifyTwoFactorSchema), asyncHandler(async (req, res) => success(res, await authService.verifyTwoFactor(req.body.loginTicket, req.body.code))));
authRoutes.post('/2fa/enable', authenticate, asyncHandler(async (req, res) => success(res, await authService.setTwoFactor(req.auth.sub, true))));
authRoutes.post('/2fa/disable', authenticate, asyncHandler(async (req, res) => success(res, await authService.setTwoFactor(req.auth.sub, false))));
authRoutes.post('/refresh', validate(z.object({ refreshToken: z.string().min(1) })), asyncHandler(async (req, res) => success(res, await authService.refresh(req.body.refreshToken))));
authRoutes.post('/logout', validate(z.object({ refreshToken: z.string().min(1) })), asyncHandler(async (req, res) => { await authService.logout(req.body.refreshToken); return success(res, { loggedOut: true }); }));
authRoutes.post('/forgot-password', validate(z.object({ email: z.string().email().transform((value) => value.toLowerCase()) })), asyncHandler(async (req, res) => success(res, await authService.forgotPassword(req.body.email))));
authRoutes.post('/reset-password', validate(z.object({ token: z.string().min(32), password: z.string().min(8).max(128) })), asyncHandler(async (req, res) => success(res, await authService.resetPassword(req.body.token, req.body.password))));
authRoutes.get('/me', authenticate, asyncHandler(async (req, res) => success(res, await authService.me(req.auth.sub))));
