import { pool } from '../../database/connection.js';
export const wishlistRepository = {
  async list(tenantId, userId, connection = pool) { const [rows] = await connection.execute('SELECT w.product_id AS productId, p.name, p.slug, p.price, p.sale_price AS salePrice, p.status, w.created_at AS createdAt FROM wishlists w JOIN products p ON p.id = w.product_id AND p.business_id = w.business_id WHERE w.business_id = ? AND w.user_id = ? ORDER BY w.created_at DESC', [tenantId, userId]); return rows; },
  async add(productId, tenantId, userId, connection = pool) { const [product] = await connection.execute('SELECT id FROM products WHERE id = ? AND business_id = ? AND status = \'published\'', [productId, tenantId]); if (!product[0]) return null; await connection.execute('INSERT IGNORE INTO wishlists (business_id, user_id, product_id) VALUES (?, ?, ?)', [tenantId, userId, productId]); return this.list(tenantId, userId, connection); },
  async remove(productId, tenantId, userId, connection = pool) { await connection.execute('DELETE FROM wishlists WHERE business_id = ? AND user_id = ? AND product_id = ?', [tenantId, userId, productId]); return this.list(tenantId, userId, connection); },
  async clear(tenantId, userId, connection = pool) { await connection.execute('DELETE FROM wishlists WHERE business_id = ? AND user_id = ?', [tenantId, userId]); return []; }
};
