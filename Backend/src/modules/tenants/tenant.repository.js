import { pool } from '../../database/connection.js';

const fields = 'id, name, slug, niche, theme_id AS themeId, layout_template AS layoutTemplate, layout_template_selected_at AS layoutTemplateSelectedAt, status, settings, created_at AS createdAt, updated_at AS updatedAt';

export const tenantRepository = {
  async list(connection = pool) {
    const [rows] = await connection.execute(`SELECT ${fields} FROM businesses ORDER BY created_at DESC`);
    return rows;
  },
  async updateStatus(id, status, connection = pool) {
    const [result] = await connection.execute('UPDATE businesses SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0 ? this.findById(id, connection) : null;
  },
  async findById(id, connection = pool) {
    const [rows] = await connection.execute(`SELECT ${fields} FROM businesses WHERE id = ?`, [id]);
    return rows[0] || null;
  },
  async create({ name, slug, niche, themeId }, connection) {
    const [result] = await connection.execute(
      'INSERT INTO businesses (name, slug, niche, theme_id) VALUES (?, ?, ?, ?)',
      [name, slug, niche ?? null, themeId ?? 'classic']
    );
    return this.findById(result.insertId, connection);
  },
  async updateThemeId(id, themeId, connection = pool) {
    const [result] = await connection.execute('UPDATE businesses SET theme_id = ? WHERE id = ?', [themeId, id]);
    return result.affectedRows > 0 ? this.findById(id, connection) : null;
  },
  async updateLayoutTemplate(id, layoutTemplate, connection = pool) {
    const [result] = await connection.execute('UPDATE businesses SET layout_template = ?, layout_template_selected_at = CURRENT_TIMESTAMP WHERE id = ?', [layoutTemplate, id]);
    return result.affectedRows > 0 ? this.findById(id, connection) : null;
  }
};
