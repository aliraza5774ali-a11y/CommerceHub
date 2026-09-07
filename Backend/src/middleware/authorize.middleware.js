import { AppError } from '../utils/errors.js';

export function authorize(...permissions) {
  return (req, res, next) => {
    const granted = req.auth?.permissions || [];
    if (!permissions.some((permission) => granted.includes(permission))) {
      return next(new AppError('You do not have permission to perform this action', 403, 'FORBIDDEN'));
    }
    next();
  };
}

export function requireStaff(req, res, next) {
  if (!['Owner', 'Admin', 'Manager'].includes(req.auth?.role)) {
    return next(new AppError('Staff authorization is required', 403, 'FORBIDDEN'));
  }
  next();
}
