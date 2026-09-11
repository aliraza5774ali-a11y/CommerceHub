import { pool } from '../../database/connection.js';

const publicFields = `p.id, p.name, p.slug, p.description, p.price, p.sale_price AS salePrice, p.created_at AS createdAt,
       c.id AS categoryId, c.name AS categoryName, c.slug AS categorySlug`;
const adminFields = `id, name, slug, description, price, sale_price AS salePrice, sku, category_id AS categoryId, status, version, created_at AS createdAt`;

export const catalogRepository = {
  async listPublic(tenantId, connection = pool) {
    const [rows] = await connection.execute(
      `SELECT ${publicFields} FROM products p LEFT JOIN categories c ON c.id = p.category_id AND c.business_id = p.business_id WHERE p.business_id = ? AND p.status = 'published' ORDER BY p.created_at DESC`,
      [tenantId]
    );
    if (!rows.length) return rows;
    const images = await this.imagesForProducts(rows.map((row) => row.id), tenantId, connection);
    return rows.map((row) => ({ ...row, images: images.get(row.id) || [] }));
  },
  async findPublicBySlug(slug, tenantId, connection = pool) {
    const [rows] = await connection.execute(
      `SELECT ${publicFields} FROM products p LEFT JOIN categories c ON c.id = p.category_id AND c.business_id = p.business_id WHERE p.slug = ? AND p.business_id = ? AND p.status = 'published' LIMIT 1`,
      [slug, tenantId]
    );
    const product = rows[0];
    if (!product) return null;
    const [images] = await connection.execute(
      `SELECT image_url AS imageUrl, alt_text AS altText, sort_order AS sortOrder, is_primary AS isPrimary FROM product_images WHERE business_id = ? AND product_id = ? ORDER BY is_primary DESC, sort_order, id LIMIT 3`,
      [tenantId, product.id]
    );
    return { ...product, images };
  },
  // Shared by listPublic — one query for every product on the page instead
  // of one query per product. The primary (cover) image always sorts first.
  async imagesForProducts(productIds, tenantId, connection = pool) {
    if (!productIds.length) return new Map();
    const placeholders = productIds.map(() => '?').join(',');
    const [rows] = await connection.execute(
      `SELECT product_id AS productId, image_url AS imageUrl, alt_text AS altText, sort_order AS sortOrder, is_primary AS isPrimary
       FROM product_images WHERE business_id = ? AND product_id IN (${placeholders}) ORDER BY is_primary DESC, sort_order, id`,
      [tenantId, ...productIds]
    );
    const byProduct = new Map();
    for (const row of rows) {
      if (!byProduct.has(row.productId)) byProduct.set(row.productId, []);
      if (byProduct.get(row.productId).length < 3) byProduct.get(row.productId).push(row);
    }
    return byProduct;
  },
  async list(tenantId, connection = pool) {
    const [rows] = await connection.execute(`SELECT ${adminFields} FROM products WHERE business_id = ? ORDER BY created_at DESC`, [tenantId]);
    return rows;
  },
  async findById(id, tenantId, connection = pool) {
    const [rows] = await connection.execute(`SELECT ${adminFields} FROM products WHERE id = ? AND business_id = ? LIMIT 1`, [id, tenantId]);
    return rows[0] || null;
  },
  async findByIdForUpdate(id, tenantId, connection) {
    const [rows] = await connection.execute(`SELECT ${adminFields} FROM products WHERE id = ? AND business_id = ? LIMIT 1 FOR UPDATE`, [id, tenantId]);
    return rows[0] || null;
  },
  async create(input, tenantId, connection = pool) {
    const [result] = await connection.execute(
      `INSERT INTO products (business_id, name, slug, description, price, sale_price, sku, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [tenantId, input.name, input.slug, input.description || null, input.price, input.salePrice ?? null, input.sku || null, input.categoryId ?? null]
    );
    return this.findById(result.insertId, tenantId, connection);
  },
  async update(id, tenantId, version, input, connection = pool) {
    const [result] = await connection.execute(
      `UPDATE products SET name = ?, description = ?, price = ?, sale_price = ?, category_id = ?, version = version + 1 WHERE id = ? AND business_id = ? AND version = ?`,
      [input.name, input.description || null, input.price, input.salePrice ?? null, input.categoryId ?? null, id, tenantId, version]
    );
    if (!result.affectedRows) return null;
    return this.findById(id, tenantId, connection);
  },
  async publish(id, tenantId, connection) {
    const [result] = await connection.execute(`UPDATE products SET status = 'published', version = version + 1 WHERE id = ? AND business_id = ? AND status = 'draft'`, [id, tenantId]);
    if (!result.affectedRows) return null;
    return this.findById(id, tenantId, connection);
  }
};
