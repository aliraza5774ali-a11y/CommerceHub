import { env } from '../config/env.js';

export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.path}`, code: 'ROUTE_NOT_FOUND' });
}

export function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  if (statusCode >= 500) console.error(error);
  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 && env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    code: error.code || 'INTERNAL_ERROR'
  });
}
