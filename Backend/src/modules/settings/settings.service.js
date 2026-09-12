import { withTransaction } from '../../database/connection.js';
import { settingsRepository } from './settings.repository.js';
import { recordAudit } from '../../utils/audit.js';
import { AppError } from '../../utils/errors.js';
import { tenantRepository } from '../tenants/tenant.repository.js';
import { THEME_PRESETS, resolveThemeId } from '../themes/theme.presets.js';
import { LAYOUT_TEMPLATE_OPTIONS, resolveLayoutTemplateId } from '../themes/layout.templates.js';

export const settingsService = {
  async get(tenantId) { const [settings, theme, tenant] = await Promise.all([settingsRepository.ensure(tenantId), settingsRepository.ensureTheme(tenantId), tenantRepository.findById(tenantId)]); return { settings, theme: { ...theme, templateId: tenant?.themeId ?? 'classic' }, layoutTemplate: tenant?.layoutTemplate ?? 'classic', layoutTemplateChosen: Boolean(tenant?.layoutTemplateSelectedAt) }; },
  // Storefront-facing: only the theme (colors/fonts/etc.), never the full
  // settings object (store email/phone and other commerce config), and no
  // login required — the storefront visitor calling this isn't authenticated.
  async getPublicTheme(tenantId) {
    const [theme, tenant] = await Promise.all([settingsRepository.ensureTheme(tenantId), tenantRepository.findById(tenantId)]);
    return { ...theme, templateId: tenant?.themeId ?? 'classic' };
  },
  // Storefront-facing: which full layout template (Classic/Editorial/...) to
  // render. No login required, same reasoning as getPublicTheme above.
  async getPublicLayoutTemplate(tenantId) {
    const tenant = await tenantRepository.findById(tenantId);
    return { layoutTemplate: resolveLayoutTemplateId(tenant?.layoutTemplate) };
  },
  getLayoutTemplates() { return LAYOUT_TEMPLATE_OPTIONS; },
  async updateLayoutTemplate(tenantId, userId, input) {
    const layoutTemplate = resolveLayoutTemplateId(input.layoutTemplate);
    const updated = await tenantRepository.updateLayoutTemplate(tenantId, layoutTemplate);
    if (!updated) throw new AppError('Business not found', 404, 'NOT_FOUND');
    await recordAudit({ tenantId, userId, action: 'LAYOUT_TEMPLATE_UPDATED', resourceType: 'layout_template', resourceId: tenantId, metadata: { layoutTemplate } });
    return { layoutTemplate: updated.layoutTemplate, layoutTemplateChosen: true };
  },
  async update(tenantId, userId, input) { return withTransaction(async (connection) => { const current = await settingsRepository.ensure(tenantId, connection); const updated = await settingsRepository.update(tenantId, input.version ?? current.version, input, connection); if (!updated) throw new AppError('Settings changed, reload and retry', 409, 'CONFLICT'); await recordAudit({ tenantId, userId, action: 'SETTINGS_UPDATED', resourceType: 'settings', resourceId: tenantId, metadata: { fields: Object.keys(input).filter((key) => key !== 'version') }, connection }); return updated; }); },
  async updateTheme(tenantId, userId, input) { return withTransaction(async (connection) => { const current = await settingsRepository.ensureTheme(tenantId, connection); const templateId = input.templateId ? resolveThemeId(input.templateId) : null; const preset = templateId ? THEME_PRESETS[templateId] : null; const updated = await settingsRepository.updateTheme(tenantId, input.version ?? current.version, preset ? { ...preset } : input, connection); if (!updated) throw new AppError('Theme changed, reload and retry', 409, 'CONFLICT'); if (templateId) await tenantRepository.updateThemeId(tenantId, templateId, connection); await recordAudit({ tenantId, userId, action: 'THEME_UPDATED', resourceType: 'theme', resourceId: tenantId, metadata: templateId ? { templateId } : undefined, connection }); return { ...updated, templateId: templateId ?? (await tenantRepository.findById(tenantId, connection))?.themeId ?? 'classic' }; }); }
};
