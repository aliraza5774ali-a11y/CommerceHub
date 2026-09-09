import { pool } from '../../database/connection.js';

export const catalogRepository = {
  async listPublic(tenantId, connection = pool) {
    const [rows] = await connection.execute(`SELECT id, name, slug, description, price, sale_price AS salePrice, created_at AS createdAt FROM products WHERE business_id = ? AND status = 'published' ORDER BY created_at DESC`, [tenantId]);
    return rows;
  },
  async findPublicBySlug(slug, tenantId, connection = pool) {
    const [rows] = await connection.execute(`SELECT id, name, slug, description, price, sale_price AS salePrice, created_at AS createdAt FROM products WHERE slug = ? AND business_id = ? AND status = 'published' LIMIT 1`, [slug, tenantId]);
    return rows[0] || null;
  },
  async list(tenantId, connection = pool) {
    const [rows] = await connection.execute(`SELECT id, name, slug, description, price, sale_price AS salePrice, sku, status, version, created_at AS createdAt FROM products WHERE business_id = ? ORDER BY created_at DESC`, [tenantId]);
    return rows;
  },
  async findById(id, tenantId, connection = pool) {
    const [rows] = await connection.execute(`SELECT id, name, slug, description, price, sale_price AS salePrice, sku, status, version, created_at AS createdAt FROM products WHERE id = ? AND business_id = ? LIMIT 1`, [id, tenantId]);
    return rows[0] || null;
  },
  async findByIdForUpdate(id, tenantId, connection) {
    const [rows] = await connection.execute(`SELECT id, name, slug, description, price, sale_price AS salePrice, sku, status, version, created_at AS createdAt FROM products WHERE id = ? AND business_id = ? LIMIT 1 FOR UPDATE`, [id, tenantId]);
    return rows[0] || null;
  },
  async create(input, tenantId, connection = pool) {
    const [result] = await connection.execute(`INSERT INTO products (business_id, name, slug, description, price, sale_price, sku) VALUES (?, ?, ?, ?, ?, ?, ?)`, [tenantId, input.name, input.slug, input.description || null, input.price, input.salePrice ?? null, input.sku || null]);
    return this.findById(result.insertId, tenantId, connection);
  },
  async update(id, tenantId, version, input, connection = pool) {
    const [result] = await connection.execute(`UPDATE products SET name = ?, description = ?, price = ?, sale_price = ?, version = version + 1 WHERE id = ? AND business_id = ? AND version = ?`, [input.name, input.description || null, input.price, input.salePrice ?? null, id, tenantId, version]);
    if (!result.affectedRows) return null;
    return this.findById(id, tenantId, connection);
  },
  async publish(id, tenantId, connection) {
    const [result] = await connection.execute(`UPDATE products SET status = 'published', version = version + 1 WHERE id = ? AND business_id = ? AND status = 'draft'`, [id, tenantId]);
    if (!result.affectedRows) return null;
    return this.findById(id, tenantId, connection);
  }
};
