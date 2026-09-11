import { Router } from 'express';
import { z } from 'zod';
import { catalogRepository } from './catalog.repository.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import { validate } from '../../middleware/validation.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { resolveTenantFromAuth } from '../../middleware/tenant.middleware.js';
import { authorize, requireStaff } from '../../middleware/authorize.middleware.js';
import { AppError, assertFound } from '../../utils/errors.js';
import { catalogService } from './catalog.service.js';

const productSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().regex(/^[a-z0-9-]+$/).min(2).max(160),
  description: z.string().max(5000).optional(),
  price: z.coerce.number().nonnegative(),
  salePrice: z.coerce.number().nonnegative().nullable().optional(),
  sku: z.string().trim().max(80).optional(),
  categoryId: z.coerce.number().int().positive().nullable().optional()
});
const updateSchema = productSchema.extend({ version: z.coerce.number().int().nonnegative() });

export const catalogRoutes = Router();
catalogRoutes.use(authenticate, resolveTenantFromAuth);
catalogRoutes.get('/products', asyncHandler(async (req, res) => success(res, await catalogRepository.list(req.tenant.id))));
catalogRoutes.get('/products/:id', asyncHandler(async (req, res) => success(res, assertFound(await catalogRepository.findById(req.params.id, req.tenant.id), 'Product not found'))));
catalogRoutes.post('/products', authorize('catalog.create'), requireStaff, validate(productSchema), asyncHandler(async (req, res) => success(res, await catalogRepository.create(req.body, req.tenant.id), 201)));
catalogRoutes.post('/products/:id/publish', requireStaff, authorize('catalog.update'), asyncHandler(async (req, res) => success(res, await catalogService.publish({ productId: req.params.id, tenantId: req.tenant.id }))));
catalogRoutes.put('/products/:id', authorize('catalog.update'), requireStaff, validate(updateSchema), asyncHandler(async (req, res) => {
  const { version, ...input } = req.body;
  const product = await catalogRepository.update(req.params.id, req.tenant.id, version, input);
  if (!product) throw new AppError('Product changed or was not found', 409, 'CONFLICT');
  return success(res, product);
}));
