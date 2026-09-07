import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

const migrationDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), 'migrations');

async function migrationFiles() {
  return (await fs.readdir(migrationDirectory)).filter((file) => /^\d+_.+\.sql$/.test(file)).sort();
}

function statements(sql) {
  return sql.split(/;\s*(?:\r?\n|$)/).map((statement) => statement.trim()).filter(Boolean);
}

async function connect() {
  return mysql.createConnection({ host: env.DB_HOST, port: env.DB_PORT, database: env.DB_NAME, user: env.DB_USER, password: env.DB_PASSWORD });
}

async function ensureTracking(connection) {
  await connection.execute(`CREATE TABLE IF NOT EXISTS schema_migrations (
    filename VARCHAR(255) PRIMARY KEY,
    checksum CHAR(64) NOT NULL,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
}

async function status(connection) {
  const applied = new Map((await connection.execute('SELECT filename, checksum, applied_at AS appliedAt FROM schema_migrations ORDER BY filename'))[0].map((row) => [row.filename, row]));
  for (const file of await migrationFiles()) {
    const sql = await fs.readFile(path.join(migrationDirectory, file), 'utf8');
    const checksum = crypto.createHash('sha256').update(sql).digest('hex');
    const record = applied.get(file);
    console.log(`${record ? (record.checksum === checksum ? 'applied' : 'checksum-mismatch') : 'pending'}  ${file}`);
  }
}

async function migrate(connection) {
  const applied = new Map((await connection.execute('SELECT filename, checksum FROM schema_migrations'))[0].map((row) => [row.filename, row.checksum]));
  for (const file of await migrationFiles()) {
    const sql = await fs.readFile(path.join(migrationDirectory, file), 'utf8');
    const checksum = crypto.createHash('sha256').update(sql).digest('hex');
    if (applied.has(file)) {
      if (applied.get(file) !== checksum) throw new Error(`Applied migration checksum changed: ${file}`);
      continue;
    }
    for (const statement of statements(sql)) await connection.query(statement);
    await connection.execute('INSERT INTO schema_migrations (filename, checksum) VALUES (?, ?)', [file, checksum]);
    console.log(`applied  ${file}`);
  }
}

const migrationRequirements = new Map([
  ['001_initial.sql', { tables: ['businesses', 'domains', 'roles', 'permissions', 'role_permissions', 'users', 'refresh_tokens'] }],
  ['002_catalog_inventory.sql', { tables: ['products', 'inventory', 'inventory_movements'] }],
  ['003_core_commerce.sql', { tables: ['carts', 'cart_items', 'promotions', 'promotion_usages', 'orders', 'order_items', 'payments', 'shipping_addresses', 'shipping_methods', 'shipments', 'returns'] }],
  ['004_platform.sql', { tables: ['store_settings', 'store_themes', 'cms_pages', 'cms_sections', 'cms_revisions', 'media', 'notifications', 'tax_rules', 'audit_logs'], columns: [['users', 'is_platform_admin'], ['domains', 'is_primary']] }],
  ['005_product_publish_status.sql', { columns: [['products', 'status']] }],
  ['006_active_cart_uniqueness.sql', { columns: [['carts', 'active_user_id']] }],
  ['007_role_permissions.sql', { tables: ['permissions', 'role_permissions'] }],
  ['008_completion.sql', { tables: ['password_reset_tokens', 'categories', 'brands', 'product_attributes', 'product_variants', 'product_images', 'warehouses', 'warehouse_stock', 'inventory_reservations', 'inventory_transfers', 'order_timeline', 'order_notes', 'payment_events', 'shipment_events', 'return_events', 'wishlists', 'reviews', 'blog_posts'] }],
  ['009_shipping_rates.sql', { columns: [['shipping_methods', 'minimum_order'], ['domains', 'verification_token']] }]
]);

async function schemaHas(connection, requirement) {
  for (const table of requirement.tables || []) {
    const [rows] = await connection.execute('SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ? LIMIT 1', [table]);
    if (!rows.length) return false;
  }
  for (const [table, column] of requirement.columns || []) {
    const [rows] = await connection.execute('SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ? LIMIT 1', [table, column]);
    if (!rows.length) return false;
  }
  return true;
}

async function reconcile(connection) {
  const applied = new Map((await connection.execute('SELECT filename, checksum FROM schema_migrations'))[0].map((row) => [row.filename, row.checksum]));
  for (const file of await migrationFiles()) {
    if (applied.has(file)) continue;
    const requirement = migrationRequirements.get(file);
    if (!requirement || !(await schemaHas(connection, requirement))) throw new Error(`Cannot reconcile ${file}: required schema objects are missing`);
    const sql = await fs.readFile(path.join(migrationDirectory, file), 'utf8');
    const checksum = crypto.createHash('sha256').update(sql).digest('hex');
    await connection.execute('INSERT INTO schema_migrations (filename, checksum) VALUES (?, ?)', [file, checksum]);
    console.log(`reconciled  ${file}`);
  }
}

const command = process.argv[2] || 'migrate';
const connection = await connect();
try {
  await ensureTracking(connection);
  if (command === 'status') await status(connection);
  else if (command === 'migrate') await migrate(connection);
  else if (command === 'reconcile') await reconcile(connection);
  else throw new Error(`Unknown migration command: ${command}`);
} finally {
  await connection.end();
}
