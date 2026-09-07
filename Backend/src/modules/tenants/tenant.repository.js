import { pool } from '../../database/connection.js';

export const tenantRepository = {
  async list(connection = pool) {
    const [rows] = await connection.execute('SELECT id, name, slug, status, settings, created_at AS createdAt, updated_at AS updatedAt FROM businesses ORDER BY created_at DESC');
    return rows;
  },
  async updateStatus(id, status, connection = pool) {
    const [result] = await connection.execute('UPDATE businesses SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0 ? this.findById(id, connection) : null;
  },
  async findById(id, connection = pool) {
    const [rows] = await connection.execute('SELECT id, name, slug, status, settings, created_at AS createdAt FROM businesses WHERE id = ?', [id]);
    return rows[0] || null;
  },
  async create({ name, slug }, connection) {
    const [result] = await connection.execute('INSERT INTO businesses (name, slug) VALUES (?, ?)', [name, slug]);
    return this.findById(result.insertId, connection);
  }
};
