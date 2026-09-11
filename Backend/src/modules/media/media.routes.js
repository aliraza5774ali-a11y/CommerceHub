import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth.middleware.js';
import { resolveTenantFromAuth } from '../../middleware/tenant.middleware.js';
import { requireStaff } from '../../middleware/authorize.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import { AppError } from '../../utils/errors.js';
import { env } from '../../config/env.js';
import { mediaRepository } from './media.repository.js';

const schema = z.object({ fileName: z.string().min(1).max(255), fileUrl: z.string().url().max(1000), mimeType: z.string().min(3).max(120), fileSize: z.coerce.number().int().nonnegative(), altText: z.string().max(255).optional(), metadata: z.record(z.unknown()).optional() });

// Uploaded files land under <repo>/uploads/<tenantId>/<random>.<ext> and are
// served back out from app.js at /uploads/... — a local-disk store is enough
// for this environment; swap the storage engine here if you move to S3/etc.
const uploadRoot = path.join(process.cwd(), 'uploads');
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(uploadRoot, String(req.tenant.id));
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).slice(0, 10);
    cb(null, `${Date.now()}-${crypto.randomUUID()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, ALLOWED_MIME.has(file.mimetype))
});

export const mediaRoutes = Router();
mediaRoutes.use(authenticate, resolveTenantFromAuth);
mediaRoutes.get('/', asyncHandler(async (req, res) => success(res, await mediaRepository.list(req.tenant.id))));
mediaRoutes.post(
  '/upload',
  requireStaff,
  (req, res, next) => upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) return next(new AppError(err.code === 'LIMIT_FILE_SIZE' ? 'File is too large (max 5MB)' : err.message, 400, 'INVALID_UPLOAD'));
    if (err) return next(err);
    next();
  }),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new AppError('No file uploaded, or file type is not one of jpeg/png/webp/gif', 400, 'INVALID_UPLOAD');
    const fileUrl = `${env.APP_URL}/uploads/${req.tenant.id}/${req.file.filename}`;
    const media = await mediaRepository.create(
      { fileName: req.file.originalname, fileUrl, mimeType: req.file.mimetype, fileSize: req.file.size },
      req.tenant.id,
      req.auth.sub
    );
    return success(res, media, 201);
  })
);
mediaRoutes.post('/', requireStaff, validate(schema), asyncHandler(async (req, res) => success(res, await mediaRepository.create(req.body, req.tenant.id, req.auth.sub), 201)));
mediaRoutes.delete('/:id', requireStaff, asyncHandler(async (req, res) => { if (!(await mediaRepository.remove(req.params.id, req.tenant.id))) return res.status(404).json({ success: false, message: 'Media not found', code: 'MEDIA_NOT_FOUND' }); return success(res, null); }));
