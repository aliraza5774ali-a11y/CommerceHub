import { AppError } from '../utils/errors.js';

export function requirePlatformAdmin(req, res, next) {
  if (!req.auth?.isPlatformAdmin) return next(new AppError('Platform administrator authorization is required', 403, 'UNAUTHORIZED_PLATFORM_OPERATION'));
  next();
}
