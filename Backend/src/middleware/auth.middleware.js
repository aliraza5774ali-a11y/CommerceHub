import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/errors.js';

export function authenticate(req, res, next) {
  const header = req.get('authorization');
  if (!header?.startsWith('Bearer ')) return next(new AppError('Authentication required', 401, 'UNAUTHENTICATED'));
  try {
    req.auth = jwt.verify(header.slice(7), env.JWT_ACCESS_SECRET, { subject: undefined });
    next();
  } catch {
    next(new AppError('Invalid or expired access token', 401, 'UNAUTHENTICATED'));
  }
}
