import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { withTransaction } from '../../database/connection.js';
import { AppError, assertFound } from '../../utils/errors.js';
import { authRepository } from './auth.repository.js';
import { tenantRepository } from '../tenants/tenant.repository.js';
import { domainRepository } from '../domains/domain.repository.js';
import { THEME_PRESETS, resolveThemeId } from '../themes/theme.presets.js';

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
function sixDigitCode() { return String(crypto.randomInt(0, 1000000)).padStart(6, '0'); }

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
        const themeId = resolveThemeId(input.themeId);
        tenant = await tenantRepository.create({ name: input.storeName, slug, niche: input.niche, themeId }, connection);
        await domainRepository.create({ businessId: tenant.id, host: `${slug}.${env.ROOT_DOMAIN}` }, connection);

        // Seed initial business settings so the admin panel never renders on an
        // empty settings object, and apply the chosen starter template's colors.
        await connection.execute(
          'INSERT INTO store_settings (business_id, store_name, store_email, store_phone, country) VALUES (?, ?, ?, ?, ?)',
          [tenant.id, input.storeName, input.email, input.phone, input.country]
        );
        const preset = THEME_PRESETS[themeId];
        await connection.execute(
          `INSERT INTO store_themes (business_id, primary_color, secondary_color, accent_color, background_color, text_color, font_family, button_style, border_radius)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [tenant.id, preset.primaryColor, preset.secondaryColor, preset.accentColor, preset.backgroundColor, preset.textColor, preset.fontFamily, preset.buttonStyle, preset.borderRadius]
        );

        const [roles] = await connection.execute('SELECT id FROM roles WHERE name = ? LIMIT 1', ['Owner']);
        roleId = roles[0]?.id;
      }
      const user = await authRepository.createUser({ tenantId: tenant.id, email: input.email, passwordHash, firstName: input.firstName, lastName: input.lastName, roleId }, connection);
      return { tenant, user };
    });
    return this.issueSession(result.user);
  },

  // Storefront customer login stays tenant-scoped and single-step: the domain
  // already resolved which business we're signing into, so there is no
  // business-selection or 2FA step here (that only applies to business/staff
  // login on the platform domain, per the auth flow spec).
  async login({ email, password }, tenantContext = null) {
    if (tenantContext) {
      const user = assertFound(await authRepository.findByEmail(email, tenantContext.id), 'Invalid email or password');
      if (user.status !== 'active' || !(await bcrypt.compare(password, user.passwordHash))) throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
      return this.issueSession(user);
    }

    // Platform-domain business login: the same email may own/staff more than
    // one business, since email uniqueness is scoped per tenant, not global.
    const candidates = await authRepository.findAllStaffByEmail(email);
    const matches = [];
    for (const candidate of candidates) {
      if (candidate.status === 'active' && candidate.businessStatus === 'active' && (await bcrypt.compare(password, candidate.passwordHash))) {
        matches.push(candidate);
      }
    }
    if (!matches.length) throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');

    if (matches.length > 1) {
      return {
        requiresBusinessSelection: true,
        loginTicket: this.issueLoginTicket(matches.map((m) => ({ userId: m.id, businessId: m.tenantId })), 'select-business'),
        businesses: matches.map((m) => ({ id: m.tenantId, name: m.businessName, slug: m.businessSlug }))
      };
    }
    return this.continueAfterCredentials(matches[0]);
  },

  async selectBusiness(loginTicket, businessId) {
    const payload = this.verifyLoginTicket(loginTicket, 'select-business');
    const candidate = payload.candidates.find((c) => String(c.businessId) === String(businessId));
    if (!candidate) throw new AppError('That business is not available for this login', 400, 'INVALID_BUSINESS_SELECTION');
    const user = assertFound(await authRepository.findById(candidate.userId));
    return this.continueAfterCredentials(user);
  },

  // Shared step after credentials (and, if applicable, business selection)
  // succeed: branches into the optional 2FA step, per the account's setting.
  async continueAfterCredentials(user) {
    if (!user.twoFactorEnabled) return this.issueSession(user);
    const code = sixDigitCode();
    await authRepository.createTwoFactorCode({ userId: user.id, codeHash: hashToken(code), expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
    return {
      requires2FA: true,
      loginTicket: this.issueLoginTicket([{ userId: user.id, businessId: user.tenantId }], '2fa'),
      // Development-safe delivery boundary: wire this to an email/SMS provider in production.
      ...(env.NODE_ENV === 'production' ? {} : { devCode: code })
    };
  },

  async verifyTwoFactor(loginTicket, code) {
    const payload = this.verifyLoginTicket(loginTicket, '2fa');
    const candidate = payload.candidates[0];
    const valid = await authRepository.consumeTwoFactorCode(candidate.userId, hashToken(code));
    if (!valid) throw new AppError('Invalid or expired verification code', 401, 'INVALID_2FA_CODE');
    const user = assertFound(await authRepository.findById(candidate.userId));
    return this.issueSession(user);
  },

  async setTwoFactor(userId, enabled) {
    await authRepository.setTwoFactor(userId, enabled);
    return { twoFactorEnabled: enabled };
  },

  issueLoginTicket(candidates, stage) {
    return jwt.sign({ purpose: 'login-challenge', stage, candidates }, env.JWT_ACCESS_SECRET, { expiresIn: '5m' });
  },
  verifyLoginTicket(token, expectedStage) {
    let payload;
    try { payload = jwt.verify(token, env.JWT_ACCESS_SECRET); } catch { throw new AppError('Login session expired, please sign in again', 401, 'LOGIN_TICKET_EXPIRED'); }
    if (payload.purpose !== 'login-challenge' || payload.stage !== expectedStage) throw new AppError('Invalid login session', 400, 'INVALID_LOGIN_TICKET');
    return payload;
  },

  async issueSession(user) {
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
    return this.issueSession(user);
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
