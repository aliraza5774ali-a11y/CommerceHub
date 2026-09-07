import { pool } from '../../database/connection.js';

const cartFields = `c.id, c.business_id AS tenantId, c.user_id AS userId, c.status, c.coupon_code AS couponCode, c.created_at AS createdAt`;
export const cartRepository = {
  async productForCart(productId, tenantId, connection = pool) {
    const [rows] = await connection.execute(`SELECT p.id AS productId, p.name, p.sku, p.price, p.sale_price AS salePrice, p.status, COALESCE(i.quantity, 0) AS stockQuantity, COALESCE(i.reserved_quantity, 0) AS reservedQuantity FROM products p LEFT JOIN inventory i ON i.product_id = p.id AND i.business_id = p.business_id WHERE p.id = ? AND p.business_id = ? LIMIT 1`, [productId, tenantId]);
    return rows[0] || null;
  },
  async findActive(userId, tenantId, connection = pool) {
    const [rows] = await connection.execute(`SELECT ${cartFields} FROM carts c WHERE c.id = ? AND c.business_id = ? AND c.user_id = ? AND c.status = 'active' LIMIT 1`, [userId, tenantId, userId]);
    return rows[0] || null;
  },
  async findOrCreate(userId, tenantId, connection = pool) {
    const [rows] = await connection.execute(`SELECT ${cartFields} FROM carts c WHERE c.business_id = ? AND c.user_id = ? AND c.status = 'active' LIMIT 1`, [tenantId, userId]);
    if (rows[0]) return rows[0];
    const [result] = await connection.execute('INSERT INTO carts (business_id, user_id) VALUES (?, ?)', [tenantId, userId]);
    return this.findById(result.insertId, tenantId, userId, connection);
  },
  async findById(cartId, tenantId, userId, connection = pool) {
    const [rows] = await connection.execute(`SELECT ${cartFields} FROM carts c WHERE c.id = ? AND c.business_id = ? AND c.user_id = ? LIMIT 1`, [cartId, tenantId, userId]);
    return rows[0] || null;
  },
  async items(cartId, tenantId, connection = pool) {
    const [rows] = await connection.execute(`SELECT ci.id, ci.product_id AS productId, ci.quantity, p.name, p.sku, p.price, p.sale_price AS salePrice, p.status, i.quantity AS stockQuantity, i.reserved_quantity AS reservedQuantity FROM cart_items ci JOIN products p ON p.id = ci.product_id AND p.business_id = ci.business_id LEFT JOIN inventory i ON i.product_id = ci.product_id AND i.business_id = ci.business_id WHERE ci.cart_id = ? AND ci.business_id = ? ORDER BY ci.created_at`, [cartId, tenantId]);
    return rows;
  },
  async addItem(cartId, tenantId, productId, quantity, connection = pool) {
    await connection.execute(`INSERT INTO cart_items (cart_id, business_id, product_id, quantity) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`, [cartId, tenantId, productId, quantity]);
  },
  async updateItem(itemId, cartId, tenantId, quantity, connection = pool) {
    const [result] = await connection.execute('UPDATE cart_items SET quantity = ? WHERE id = ? AND cart_id = ? AND business_id = ?', [quantity, itemId, cartId, tenantId]);
    return result.affectedRows > 0;
  },
  async removeItem(itemId, cartId, tenantId, connection = pool) {
    const [result] = await connection.execute('DELETE FROM cart_items WHERE id = ? AND cart_id = ? AND business_id = ?', [itemId, cartId, tenantId]);
    return result.affectedRows > 0;
  },
  async clear(cartId, tenantId, connection = pool) { await connection.execute('DELETE FROM cart_items WHERE cart_id = ? AND business_id = ?', [cartId, tenantId]); },
  async setCoupon(cartId, tenantId, code, connection = pool) { await connection.execute('UPDATE carts SET coupon_code = ? WHERE id = ? AND business_id = ?', [code, cartId, tenantId]); },
  async convert(cartId, tenantId, connection = pool) { await connection.execute("UPDATE carts SET status = 'converted' WHERE id = ? AND business_id = ?", [cartId, tenantId]); }
};
