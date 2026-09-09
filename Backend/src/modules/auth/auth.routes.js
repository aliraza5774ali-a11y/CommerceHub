import { Router } from 'express';
import { z } from 'zod';
import { authService } from './auth.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import { validate } from '../../middleware/validation.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { resolveTenant } from '../../middleware/tenant.middleware.js';

const registerNewStoreSchema = z.object({ storeName: z.string().trim().min(2).max(120), storeSlug: z.string().regex(/^[a-z0-9-]+$/).min(2).max(60), email: z.string().email().transform((value) => value.toLowerCase()), password: z.string().min(8).max(128), firstName: z.string().trim().min(1).max(80), lastName: z.string().trim().min(1).max(80) });
const registerCustomerSchema = z.object({ email: z.string().email().transform((value) => value.toLowerCase()), password: z.string().min(8).max(128), firstName: z.string().trim().min(1).max(80), lastName: z.string().trim().min(1).max(80) });

const loginSchema = z.object({ email: z.string().email().transform((value) => value.toLowerCase()), password: z.string().min(1) });

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

authRoutes.post('/register', optionalTenant, dynamicRegisterValidation, asyncHandler(async (req, res) => success(res, await authService.register(req.body, req.tenant), 201)));
// A store login must be scoped to the resolved store.  This is especially
// important in development where the SPA calls the API host and supplies the
// storefront host through the supported `domain` query parameter.
authRoutes.post('/login', optionalTenant, validate(loginSchema), asyncHandler(async (req, res) => success(res, await authService.login(req.body, req.tenant))));
authRoutes.post('/refresh', validate(z.object({ refreshToken: z.string().min(1) })), asyncHandler(async (req, res) => success(res, await authService.refresh(req.body.refreshToken))));
authRoutes.post('/logout', validate(z.object({ refreshToken: z.string().min(1) })), asyncHandler(async (req, res) => { await authService.logout(req.body.refreshToken); return success(res, { loggedOut: true }); }));
authRoutes.post('/forgot-password', validate(z.object({ email: z.string().email().transform((value) => value.toLowerCase()) })), asyncHandler(async (req, res) => success(res, await authService.forgotPassword(req.body.email))));
authRoutes.post('/reset-password', validate(z.object({ token: z.string().min(32), password: z.string().min(8).max(128) })), asyncHandler(async (req, res) => success(res, await authService.resetPassword(req.body.token, req.body.password))));
authRoutes.get('/me', authenticate, asyncHandler(async (req, res) => success(res, await authService.me(req.auth.sub))));
