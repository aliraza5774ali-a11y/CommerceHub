-- Preserve products created under the earlier `active` lifecycle as sellable products.
ALTER TABLE products MODIFY status ENUM('draft', 'published', 'active', 'archived') NOT NULL DEFAULT 'draft';
UPDATE products SET status = 'published' WHERE status = 'active';
ALTER TABLE products MODIFY status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft';
