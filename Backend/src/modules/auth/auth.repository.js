import { pool } from '../../database/connection.js';

const userSelect = `SELECT u.id, u.business_id AS tenantId, u.email, u.first_name AS firstName, u.last_name AS lastName, u.password_hash AS passwordHash, u.status, u.is_platform_admin AS isPlatformAdmin, u.two_factor_enabled AS twoFactorEnabled, r.name AS roleName FROM users u LEFT JOIN roles r ON r.id = u.role_id`;

export const authRepository = {
  async findByEmail(email, tenantIdOrConnection = pool) {
    const scoped = typeof tenantIdOrConnection === 'number' || typeof tenantIdOrConnection === 'string';
    const connection = scoped ? pool : tenantIdOrConnection;
    const [rows] = await connection.execute(`${userSelect} WHERE u.email = ?${scoped ? ' AND u.business_id = ?' : ''} LIMIT 1`, scoped ? [email, tenantIdOrConnection] : [email]);
    return rows[0] || null;
  },
  // Used for platform-domain business login: the same email can be the Owner/Staff
  // account of more than one business, since email uniqueness is scoped per tenant.
  async findAllStaffByEmail(email, connection = pool) {
    const [rows] = await connection.execute(
      `SELECT u.id, u.business_id AS tenantId, u.email, u.first_name AS firstName, u.last_name AS lastName,
              u.password_hash AS passwordHash, u.status, u.is_platform_admin AS isPlatformAdmin,
              u.two_factor_enabled AS twoFactorEnabled, r.name AS roleName,
              b.name AS businessName, b.slug AS businessSlug, b.status AS businessStatus
       FROM users u
       LEFT JOIN roles r ON r.id = u.role_id
       JOIN businesses b ON b.id = u.business_id
       WHERE u.email = ? AND u.role_id IS NOT NULL`,
      [email]
    );
    return rows;
  },
  async findById(id, connection = pool) {
    const [rows] = await connection.execute(`${userSelect} WHERE u.id = ? LIMIT 1`, [id]);
    return rows[0] || null;
  },
  async permissionsForUser(userId, connection = pool) {
    const [rows] = await connection.execute(`SELECT p.name FROM users u JOIN role_permissions rp ON rp.role_id = u.role_id JOIN permissions p ON p.id = rp.permission_id WHERE u.id = ? ORDER BY p.name`, [userId]);
    return rows.map((row) => row.name);
  },
  async createUser({ tenantId, email, passwordHash, firstName, lastName, roleId }, connection) {
    const [result] = await connection.execute(`INSERT INTO users (business_id, role_id, email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)`, [tenantId, roleId, email, passwordHash, firstName, lastName]);
    return this.findById(result.insertId, connection);
  },
  async setTwoFactor(userId, enabled, connection = pool) {
    await connection.execute('UPDATE users SET two_factor_enabled = ? WHERE id = ?', [enabled, userId]);
  },
  async createTwoFactorCode({ userId, codeHash, expiresAt }, connection = pool) {
    await connection.execute('DELETE FROM two_factor_codes WHERE user_id = ? AND consumed_at IS NULL', [userId]);
    await connection.execute('INSERT INTO two_factor_codes (user_id, code_hash, expires_at) VALUES (?, ?, ?)', [userId, codeHash, expiresAt]);
  },
  async consumeTwoFactorCode(userId, codeHash, connection = pool) {
    const [rows] = await connection.execute(
      'SELECT id FROM two_factor_codes WHERE user_id = ? AND code_hash = ? AND consumed_at IS NULL AND expires_at > CURRENT_TIMESTAMP LIMIT 1',
      [userId, codeHash]
    );
    if (!rows[0]) return false;
    await connection.execute('UPDATE two_factor_codes SET consumed_at = CURRENT_TIMESTAMP WHERE id = ?', [rows[0].id]);
    return true;
  },
  async createRefreshToken({ userId, tokenHash, expiresAt }, connection = pool) {
    await connection.execute('INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)', [userId, tokenHash, expiresAt]);
  },
  async consumeRefreshToken(tokenHash, connection = pool) {
    const [rows] = await connection.execute(`SELECT id, user_id AS userId, expires_at AS expiresAt FROM refresh_tokens WHERE token_hash = ? AND revoked_at IS NULL LIMIT 1`, [tokenHash]);
    if (!rows[0] || new Date(rows[0].expiresAt) <= new Date()) return null;
    await connection.execute('UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE id = ?', [rows[0].id]);
    return rows[0];
  },
  async revokeRefreshToken(tokenHash, connection = pool) {
    const [result] = await connection.execute('UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE token_hash = ? AND revoked_at IS NULL', [tokenHash]);
    return result.affectedRows > 0;
  },
  async createPasswordResetToken({ userId, tokenHash, expiresAt }, connection = pool) {
    await connection.execute('UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE user_id = ? AND used_at IS NULL', [userId]);
    await connection.execute('INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)', [userId, tokenHash, expiresAt]);
  },
  async consumePasswordResetToken(tokenHash, connection = pool) {
    const [rows] = await connection.execute('SELECT id, user_id AS userId FROM password_reset_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > CURRENT_TIMESTAMP LIMIT 1 FOR UPDATE', [tokenHash]);
    if (!rows[0]) return null;
    await connection.execute('UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ?', [rows[0].id]);
    return rows[0];
  },
  async updatePassword(userId, passwordHash, connection = pool) {
    await connection.execute('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, userId]);
    await connection.execute('UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE user_id = ? AND revoked_at IS NULL', [userId]);
  }
};
