import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth.middleware.js';
import { resolveTenantFromAuth } from '../../middleware/tenant.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import { cartService } from './cart.service.js';

const itemSchema = z.object({ productId: z.coerce.number().int().positive(), quantity: z.coerce.number().int().positive() });
const quantitySchema = z.object({ quantity: z.coerce.number().int().positive() });
export const cartRoutes = Router();
cartRoutes.use(authenticate, resolveTenantFromAuth);
cartRoutes.post('/', asyncHandler(async (req, res) => success(res, await cartService.get(req.auth.sub, req.tenant.id), 201)));
cartRoutes.get('/', asyncHandler(async (req, res) => success(res, await cartService.get(req.auth.sub, req.tenant.id))));
cartRoutes.post('/items', validate(itemSchema), asyncHandler(async (req, res) => success(res, await cartService.add(req.auth.sub, req.tenant.id, req.body), 201)));
cartRoutes.patch('/items/:itemId', validate(quantitySchema), asyncHandler(async (req, res) => success(res, await cartService.update(req.auth.sub, req.tenant.id, req.params.itemId, req.body.quantity))));
cartRoutes.delete('/items/:itemId', asyncHandler(async (req, res) => success(res, await cartService.remove(req.auth.sub, req.tenant.id, req.params.itemId))));
cartRoutes.delete('/', asyncHandler(async (req, res) => success(res, await cartService.clear(req.auth.sub, req.tenant.id))));
