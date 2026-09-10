import { pool, withTransaction } from '../../database/connection.js';

export const inventoryRepository = {
  async listForTenant(tenantId, connection = pool) {
    const [rows] = await connection.execute(
      `SELECT p.id AS productId, p.name, p.sku, p.status,
              i.quantity, i.reserved_quantity AS reservedQuantity, i.version
       FROM products p
       LEFT JOIN inventory i ON i.product_id = p.id AND i.business_id = p.business_id
       WHERE p.business_id = ?
       ORDER BY p.name`,
      [tenantId]
    );
    return rows;
  },
  async get(productId, tenantId, connection = pool) {
    const [rows] = await connection.execute('SELECT product_id AS productId, quantity, reserved_quantity AS reservedQuantity, version FROM inventory WHERE product_id = ? AND business_id = ? LIMIT 1', [productId, tenantId]);
    return rows[0] || null;
  },
  async initialize(productId, tenantId, connection) {
    // The composite primary key makes this idempotent while retaining an existing stock record.
    await connection.execute(`INSERT INTO inventory (product_id, business_id, quantity, reserved_quantity, version)
      VALUES (?, ?, 0, 0, 1)
      ON DUPLICATE KEY UPDATE product_id = VALUES(product_id)`, [productId, tenantId]);
    return this.get(productId, tenantId, connection);
  },
  async adjust({ productId, tenantId, delta, reason }) {
    return withTransaction(async (connection) => {
      const [rows] = await connection.execute('SELECT quantity, reserved_quantity AS reservedQuantity, version FROM inventory WHERE product_id = ? AND business_id = ? FOR UPDATE', [productId, tenantId]);
      if (!rows[0]) throw Object.assign(new Error('Inventory record not found'), { statusCode: 404, code: 'NOT_FOUND' });
      const available = rows[0].quantity - rows[0].reservedQuantity;
      if (delta < 0 && available < Math.abs(delta)) throw Object.assign(new Error('Insufficient available stock'), { statusCode: 409, code: 'INSUFFICIENT_STOCK' });
      await connection.execute('UPDATE inventory SET quantity = quantity + ?, version = version + 1 WHERE product_id = ? AND business_id = ?', [delta, productId, tenantId]);
      await connection.execute('INSERT INTO inventory_movements (business_id, product_id, quantity_delta, reason) VALUES (?, ?, ?, ?)', [tenantId, productId, delta, reason]);
      return this.get(productId, tenantId, connection);
    });
  }
};
