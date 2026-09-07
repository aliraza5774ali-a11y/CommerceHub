import { domainRepository } from '../modules/domains/domain.repository.js';
import { tenantRepository } from '../modules/tenants/tenant.repository.js';
import { AppError } from '../utils/errors.js';

export async function resolveTenant(req, res, next) {
  try {
    const hostname = (req.hostname || '').toLowerCase();
    const tenant = await domainRepository.findTenantByHost(hostname);
    if (!tenant) return next(new AppError('Store could not be resolved from this domain', 404, 'TENANT_NOT_FOUND'));
    if (tenant.status !== 'active') return next(new AppError('Store is not active', 403, 'TENANT_INACTIVE'));
    req.tenant = tenant;
    next();
  } catch (error) { next(error); }
}

export function requireTenant(req, res, next) {
  if (!req.tenant) return next(new AppError('Tenant context is required', 400, 'TENANT_REQUIRED'));
  next();
}

export async function resolveTenantFromAuth(req, res, next) {
  try {
    if (!req.auth?.tenantId) return next(new AppError('Authenticated tenant context is missing', 403, 'TENANT_REQUIRED'));
    req.tenant = await tenantRepository.findById(req.auth.tenantId);
    if (!req.tenant) return next(new AppError('Tenant not found', 404, 'TENANT_NOT_FOUND'));
    next();
  } catch (error) { next(error); }
}
