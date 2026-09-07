import { withTransaction } from '../../database/connection.js';
import { settingsRepository } from './settings.repository.js';
import { recordAudit } from '../../utils/audit.js';
import { AppError } from '../../utils/errors.js';

export const settingsService = {
  async get(tenantId) { return { settings: await settingsRepository.ensure(tenantId), theme: await settingsRepository.ensureTheme(tenantId) }; },
  async update(tenantId, userId, input) { return withTransaction(async (connection) => { const current = await settingsRepository.ensure(tenantId, connection); const updated = await settingsRepository.update(tenantId, input.version ?? current.version, input, connection); if (!updated) throw new AppError('Settings changed, reload and retry', 409, 'CONFLICT'); await recordAudit({ tenantId, userId, action: 'SETTINGS_UPDATED', resourceType: 'settings', resourceId: tenantId, metadata: { fields: Object.keys(input).filter((key) => key !== 'version') }, connection }); return updated; }); },
  async updateTheme(tenantId, userId, input) { return withTransaction(async (connection) => { const current = await settingsRepository.ensureTheme(tenantId, connection); const updated = await settingsRepository.updateTheme(tenantId, input.version ?? current.version, input, connection); if (!updated) throw new AppError('Theme changed, reload and retry', 409, 'CONFLICT'); await recordAudit({ tenantId, userId, action: 'THEME_UPDATED', resourceType: 'theme', resourceId: tenantId, connection }); return updated; }); }
};
