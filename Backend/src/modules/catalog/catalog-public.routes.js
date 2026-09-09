import { Router } from 'express';
import { z } from 'zod';
import { catalogRepository } from './catalog.repository.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import { resolveTenant } from '../../middleware/tenant.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { assertFound } from '../../utils/errors.js';

export const catalogPublicRoutes = Router();
catalogPublicRoutes.use(resolveTenant);
catalogPublicRoutes.get('/products', asyncHandler(async (req, res) => success(res, await catalogRepository.listPublic(req.tenant.id))));
catalogPublicRoutes.get('/products/:slug', validate(z.object({ slug: z.string().regex(/^[a-z0-9-]+$/) }), 'params'), asyncHandler(async (req, res) => success(res, assertFound(await catalogRepository.findPublicBySlug(req.params.slug, req.tenant.id), 'Product not found'))));