import { pool } from '../../database/connection.js';
export const roleRepository = {
  async roles(connection = pool) { const [rows] = await connection.execute('SELECT id, name FROM roles ORDER BY name'); return rows; },
  async role(id, connection = pool) { const [rows] = await connection.execute('SELECT id, name FROM roles WHERE id = ?', [id]); return rows[0] || null; },
  async permissions(connection = pool) { const [rows] = await connection.execute('SELECT id, name FROM permissions ORDER BY name'); return rows; },
  async rolePermissions(id, connection = pool) { const [rows] = await connection.execute('SELECT p.id, p.name FROM permissions p JOIN role_permissions rp ON rp.permission_id = p.id WHERE rp.role_id = ? ORDER BY p.name', [id]); return rows; },
  async create(name, connection = pool) { const [result] = await connection.execute('INSERT INTO roles (name) VALUES (?)', [name]); return this.role(result.insertId, connection); },
  async update(id, name, connection = pool) { await connection.execute('UPDATE roles SET name = ? WHERE id = ?', [name, id]); return this.role(id, connection); },
  async delete(id, connection = pool) { const [users] = await connection.execute('SELECT COUNT(*) AS count FROM users WHERE role_id = ?', [id]); if (Number(users[0].count)) return false; const [result] = await connection.execute('DELETE FROM roles WHERE id = ? AND name NOT IN (\'Owner\', \'Admin\')', [id]); return result.affectedRows > 0; },
  async replacePermissions(id, permissionIds, connection) { await connection.execute('DELETE FROM role_permissions WHERE role_id = ?', [id]); for (const permissionId of permissionIds) await connection.execute('INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)', [id, permissionId]); return this.rolePermissions(id, connection); }
};
