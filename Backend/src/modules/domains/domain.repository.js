import { pool } from '../../database/connection.js';
import crypto from 'node:crypto';

export const domainRepository = {
  async list(tenantId, connection = pool) {
    const [rows] = await connection.execute('SELECT id, host, domain_type AS domainType, status, is_primary AS isPrimary, verification_status AS verificationStatus, created_at AS createdAt, updated_at AS updatedAt FROM domains WHERE business_id = ? ORDER BY is_primary DESC, created_at', [tenantId]);
    return rows;
  },
  async createDomain({ tenantId, host, domainType }, connection = pool) {
    const token = crypto.randomBytes(32).toString('hex');
    const [result] = await connection.execute('INSERT INTO domains (business_id, host, domain_type, status, verification_status, verification_token) VALUES (?, ?, ?, \'active\', \'pending\', ?)', [tenantId, host, domainType, token]);
    const created = await this.findById(result.insertId, tenantId, connection);
    // The verification token is only ever returned here, at creation time,
    // so the owner can copy it into their DNS TXT record. It is never
    // included in list()/findById() responses afterwards.
    return { ...created, verificationToken: token };
  },
  async findById(id, tenantId, connection = pool) {
    const [rows] = await connection.execute('SELECT id, host, domain_type AS domainType, status, is_primary AS isPrimary, verification_status AS verificationStatus FROM domains WHERE id = ? AND business_id = ?', [id, tenantId]);
    return rows[0] || null;
  },
  async setPrimary(id, tenantId, connection) {
    await connection.execute('UPDATE domains SET is_primary = FALSE WHERE business_id = ?', [tenantId]);
    await connection.execute('UPDATE domains SET is_primary = TRUE WHERE id = ? AND business_id = ?', [id, tenantId]);
    return this.findById(id, tenantId, connection);
  },
  async verify(id, tenantId, token, connection = pool) { const [result] = await connection.execute("UPDATE domains SET verification_status = 'verified', verified_at = CURRENT_TIMESTAMP WHERE id = ? AND business_id = ? AND verification_token = ?", [id, tenantId, token]); return result.affectedRows > 0 ? this.findById(id, tenantId, connection) : null; },
  async deleteDomain(id, tenantId, connection = pool) { const [result] = await connection.execute('DELETE FROM domains WHERE id = ? AND business_id = ? AND is_primary = FALSE', [id, tenantId]); return result.affectedRows > 0; },
  async findTenantByHost(host, connection = pool) {
    const [rows] = await connection.execute(`
      SELECT b.id, b.name, b.slug, b.theme_id AS themeId, b.status, b.settings, b.created_at AS createdAt
      FROM domains d JOIN businesses b ON b.id = d.business_id
      WHERE d.host = ? AND d.status = 'active'
      LIMIT 1`, [host]);
    return rows[0] || null;
  },
  async create({ businessId, host }, connection) {
    await connection.execute('INSERT INTO domains (business_id, host, status) VALUES (?, ?, \'active\')', [businessId, host]);
  }
};
