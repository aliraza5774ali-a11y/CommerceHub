import { withTransaction } from '../../database/connection.js';
import { cmsRepository } from './cms.repository.js';
import { recordAudit } from '../../utils/audit.js';
import { AppError, assertFound } from '../../utils/errors.js';

const sectionTypes = new Set(['navbar', 'hero', 'products', 'collection', 'best_sellers', 'testimonials', 'style_and_wear', 'blog', 'footer', 'banner', 'rich_text', 'image']);
export const cmsService = {
  async listPages(tenantId, publishedOnly = false) { return cmsRepository.listPages(tenantId, publishedOnly); },
  async getPage(id, tenantId, publishedOnly = false) { const page = assertFound(await cmsRepository.page(id, tenantId), 'CMS page not found'); if (publishedOnly && page.status !== 'PUBLISHED') throw new AppError('CMS page not found', 404, 'CMS_PAGE_NOT_FOUND'); return { ...page, sections: await cmsRepository.sections(id, tenantId) }; },
  async getPublishedBySlug(slug, tenantId) { const page = assertFound(await cmsRepository.pageBySlug(slug, tenantId, true), 'CMS page not found'); return { ...page, sections: await cmsRepository.sections(page.id, tenantId) }; },
  async createPage(input, tenantId, userId) { const page = await cmsRepository.createPage(input, tenantId, userId); await recordAudit({ tenantId, userId, action: 'CMS_CREATED', resourceType: 'page', resourceId: page.id }); return page; },
  async updatePage(id, input, tenantId, userId) { const page = await cmsRepository.updatePage(id, tenantId, userId, input); if (!page) throw new AppError('CMS page changed, reload and retry', 409, 'CONFLICT'); await recordAudit({ tenantId, userId, action: 'CMS_UPDATED', resourceType: 'page', resourceId: id }); return page; },
  async deletePage(id, tenantId, userId) { if (!(await cmsRepository.deletePage(id, tenantId))) throw new AppError('CMS page not found', 404, 'CMS_PAGE_NOT_FOUND'); await recordAudit({ tenantId, userId, action: 'CMS_DELETED', resourceType: 'page', resourceId: id }); },
  async addSection(pageId, input, tenantId, userId) { assertFound(await cmsRepository.page(pageId, tenantId), 'CMS page not found'); if (!sectionTypes.has(input.sectionType)) throw new AppError('Unsupported section type', 422, 'INVALID_SECTION_TYPE'); return cmsRepository.createSection(pageId, tenantId, userId, input); },
  async updateSection(id, input, tenantId, userId) { const section = await cmsRepository.updateSection(id, tenantId, userId, input); if (!section) throw new AppError('CMS section changed or was not found', 409, 'CONFLICT'); return section; },
  async deleteSection(id, tenantId) { if (!(await cmsRepository.deleteSection(id, tenantId))) throw new AppError('CMS section not found', 404, 'CMS_SECTION_NOT_FOUND'); },
  async reorder(items, tenantId) { return withTransaction(async (connection) => { await cmsRepository.reorder(tenantId, items, connection); return items; }); },
  async publish(id, tenantId, userId, status) { return withTransaction(async (connection) => { const page = assertFound(await cmsRepository.page(id, tenantId, connection), 'CMS page not found'); if (status === 'PUBLISHED' && page.status === 'PUBLISHED') throw new AppError('CMS page is already published', 409, 'CMS_ALREADY_PUBLISHED'); const result = await cmsRepository.publish(id, tenantId, userId, status, connection); await recordAudit({ tenantId, userId, action: status === 'PUBLISHED' ? 'CMS_PUBLISHED' : 'CMS_UNPUBLISHED', resourceType: 'page', resourceId: id, connection }); return result; }); }
};
