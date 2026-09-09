import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { withTransaction } from '../../database/connection.js';
import { AppError, assertFound } from '../../utils/errors.js';
import { authRepository } from './auth.repository.js';
import { tenantRepository } from '../tenants/tenant.repository.js';
import { domainRepository } from '../domains/domain.repository.js';

function publicUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}
async function tokenPair(user) {
  const permissions = await authRepository.permissionsForUser(user.id);

  const claims = {
    tenantId: user.tenantId,
    email: user.email,
    role: user.roleName,
    permissions,
    isPlatformAdmin: Boolean(user.isPlatformAdmin)
  };

  const accessToken = jwt.sign(
    claims,
    env.JWT_ACCESS_SECRET,
    {
      subject: String(user.id),
      expiresIn: env.ACCESS_TOKEN_TTL
    }
  );

  const refreshToken = jwt.sign(
    {
      ...claims,
      jti: crypto.randomUUID()
    },
    env.JWT_REFRESH_SECRET,
    {
      subject: String(user.id),
      expiresIn: env.REFRESH_TOKEN_TTL
    }
  );

  return {
    accessToken,
    refreshToken
  };
}
function hashToken(token) { return crypto.createHash('sha256').update(token).digest('hex'); }
function refreshExpiry() { const date = new Date(); date.setDate(date.getDate() + 30); return date; }

export const authService = {
  async register(input, tenantContext = null) {
    const existing = await authRepository.findByEmail(input.email, tenantContext?.id ?? null);
    if (existing) throw new AppError('Email is already registered', 409, 'EMAIL_EXISTS');
    const passwordHash = await bcrypt.hash(input.password, 12);
    const result = await withTransaction(async (connection) => {
      let tenant;
      let roleId = null;
      if (tenantContext) {
        tenant = tenantContext;
      } else {
        const slug = input.storeSlug.toLowerCase().trim();
        tenant = await tenantRepository.create({ name: input.storeName, slug }, connection);
        await domainRepository.create({ businessId: tenant.id, host: `${slug}.${env.ROOT_DOMAIN}` }, connection);
        const [roles] = await connection.execute('SELECT id FROM roles WHERE name = ? LIMIT 1', ['Owner']);
        roleId = roles[0]?.id;
      }
      const user = await authRepository.createUser({ tenantId: tenant.id, email: input.email, passwordHash, firstName: input.firstName, lastName: input.lastName, roleId }, connection);
      return { tenant, user };
    });
    const tokens = await tokenPair(result.user);
    await authRepository.createRefreshToken({ userId: result.user.id, tokenHash: hashToken(tokens.refreshToken), expiresAt: refreshExpiry() });
    return { user: publicUser(result.user), ...tokens };
  },
  async login({ email, password }, tenantContext = null) {
    const user = assertFound(await authRepository.findByEmail(email, tenantContext?.id), 'Invalid email or password');
    if (user.status !== 'active' || !(await bcrypt.compare(password, user.passwordHash))) throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    const tokens = await tokenPair(user);
    await authRepository.createRefreshToken({ userId: user.id, tokenHash: hashToken(tokens.refreshToken), expiresAt: refreshExpiry() });
    return { user: publicUser(user), ...tokens };
  },
  async refresh(refreshToken) {
    let payload;
    try { payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET); } catch { throw new AppError('Invalid or expired refresh token', 401, 'UNAUTHENTICATED'); }
    const consumed = await authRepository.consumeRefreshToken(hashToken(refreshToken));
    if (!consumed || String(consumed.userId) !== String(payload.sub)) throw new AppError('Invalid or expired refresh token', 401, 'UNAUTHENTICATED');
    const user = assertFound(await authRepository.findById(consumed.userId));
    const tokens = await tokenPair(user);
    await authRepository.createRefreshToken({ userId: user.id, tokenHash: hashToken(tokens.refreshToken), expiresAt: refreshExpiry() });
    return { user: publicUser(user), ...tokens };
  },
  async logout(refreshToken) {
    // Logout is deliberately idempotent; it never discloses whether a token existed.
    await authRepository.revokeRefreshToken(hashToken(refreshToken));
  },
  async forgotPassword(email) {
    const user = await authRepository.findByEmail(email);
    if (!user) return { accepted: true };
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    await authRepository.createPasswordResetToken({ userId: user.id, tokenHash: hashToken(token), expiresAt });
    // Development-safe delivery boundary: callers can hand this to a configured provider later.
    return { accepted: true, ...(env.NODE_ENV === 'production' ? {} : { resetToken: token }) };
  },
  async resetPassword(token, password) {
    const passwordHash = await bcrypt.hash(password, 12);
    return withTransaction(async (connection) => {
      const reset = assertFound(await authRepository.consumePasswordResetToken(hashToken(token), connection), 'Invalid or expired reset token');
      await authRepository.updatePassword(reset.userId, passwordHash, connection);
      return { reset: true };
    });
  },
  async me(userId) { return publicUser(assertFound(await authRepository.findById(userId))); }
};
