CREATE TABLE password_reset_tokens (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_password_reset_user (user_id, expires_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE categories (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  parent_id BIGINT UNSIGNED NULL,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(160) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  version INT UNSIGNED NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_category_tenant_slug (business_id, slug),
  KEY idx_categories_tenant_parent (business_id, parent_id),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);
CREATE TABLE brands (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(160) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE KEY uq_brand_tenant_slug (business_id, slug),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);
ALTER TABLE products ADD COLUMN category_id BIGINT UNSIGNED NULL, ADD COLUMN brand_id BIGINT UNSIGNED NULL, ADD COLUMN barcode VARCHAR(80) NULL, ADD KEY idx_products_tenant_category (business_id, category_id), ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL, ADD FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL;
CREATE TABLE product_attributes (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(80) NOT NULL,
  UNIQUE KEY uq_attribute_tenant_name (business_id, name),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);
CREATE TABLE product_variants (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  sku VARCHAR(80) NOT NULL,
  barcode VARCHAR(80) NULL,
  price DECIMAL(12,2) NOT NULL,
  sale_price DECIMAL(12,2) NULL,
  weight DECIMAL(10,3) NULL,
  attributes JSON NULL,
  version INT UNSIGNED NOT NULL DEFAULT 1,
  UNIQUE KEY uq_variant_tenant_sku (business_id, sku),
  KEY idx_variants_tenant_product (business_id, product_id),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
CREATE TABLE product_images (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  variant_id BIGINT UNSIGNED NULL,
  media_id BIGINT UNSIGNED NULL,
  image_url VARCHAR(1000) NOT NULL,
  alt_text VARCHAR(255) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  KEY idx_product_images_tenant_product (business_id, product_id, sort_order),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
  FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE SET NULL
);
CREATE TABLE warehouses (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(160) NOT NULL,
  address JSON NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  version INT UNSIGNED NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_warehouse_tenant_name (business_id, name),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);
CREATE TABLE warehouse_stock (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  warehouse_id BIGINT UNSIGNED NOT NULL,
  business_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  variant_id BIGINT UNSIGNED NULL,
  on_hand INT NOT NULL DEFAULT 0,
  reserved INT NOT NULL DEFAULT 0,
  incoming INT NOT NULL DEFAULT 0,
  damaged INT NOT NULL DEFAULT 0,
  version INT UNSIGNED NOT NULL DEFAULT 1,
  UNIQUE KEY uq_warehouse_stock_item (warehouse_id, product_id, variant_id),
  KEY idx_warehouse_stock_tenant_product (business_id, product_id),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
);
CREATE TABLE inventory_reservations (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  variant_id BIGINT UNSIGNED NULL,
  quantity INT UNSIGNED NOT NULL,
  status ENUM('RESERVED', 'RELEASED', 'COMMITTED') NOT NULL DEFAULT 'RESERVED',
  reference_type VARCHAR(40) NOT NULL,
  reference_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_reservation_reference (business_id, reference_type, reference_id, product_id, variant_id),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE RESTRICT
);
CREATE TABLE inventory_transfers (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  from_warehouse_id BIGINT UNSIGNED NOT NULL,
  to_warehouse_id BIGINT UNSIGNED NOT NULL,
  status ENUM('DRAFT', 'REQUESTED', 'IN_TRANSIT', 'RECEIVED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
  notes TEXT NULL,
  version INT UNSIGNED NOT NULL DEFAULT 1,
  created_by BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (from_warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT,
  FOREIGN KEY (to_warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);
CREATE TABLE order_timeline (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  order_id BIGINT UNSIGNED NOT NULL,
  actor_id BIGINT UNSIGNED NULL,
  event_type VARCHAR(80) NOT NULL,
  message TEXT NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_order_timeline (business_id, order_id, created_at),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL
);
CREATE TABLE order_notes (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  order_id BIGINT UNSIGNED NOT NULL,
  actor_id BIGINT UNSIGNED NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE RESTRICT
);
CREATE TABLE payment_events (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  payment_id BIGINT UNSIGNED NOT NULL,
  provider VARCHAR(80) NOT NULL,
  provider_event_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(80) NOT NULL,
  payload JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_payment_provider_event (business_id, provider, provider_event_id),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
);
CREATE TABLE shipment_events (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  shipment_id BIGINT UNSIGNED NOT NULL,
  status VARCHAR(40) NOT NULL,
  tracking_number VARCHAR(120) NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_shipment_events (business_id, shipment_id, created_at),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);
CREATE TABLE return_events (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  return_id BIGINT UNSIGNED NOT NULL,
  actor_id BIGINT UNSIGNED NULL,
  status VARCHAR(40) NOT NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_return_events (business_id, return_id, created_at),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE CASCADE,
  FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL
);
ALTER TABLE promotions ADD COLUMN free_shipping BOOLEAN NOT NULL DEFAULT FALSE, ADD COLUMN category_id BIGINT UNSIGNED NULL, ADD KEY idx_promotions_category (business_id, category_id), ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
CREATE TABLE promotion_products (
  promotion_id BIGINT UNSIGNED NOT NULL,
  business_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (promotion_id, product_id),
  FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
CREATE TABLE wishlists (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_wishlist_item (business_id, user_id, product_id),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
CREATE TABLE reviews (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  order_id BIGINT UNSIGNED NULL,
  rating TINYINT UNSIGNED NOT NULL,
  title VARCHAR(200) NULL,
  body TEXT NULL,
  status ENUM('PENDING', 'PUBLISHED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
  version INT UNSIGNED NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_review_user_product (business_id, user_id, product_id),
  KEY idx_reviews_product_status (business_id, product_id, status),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);
CREATE TABLE blog_posts (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  author_id BIGINT UNSIGNED NOT NULL,
  slug VARCHAR(180) NOT NULL,
  title VARCHAR(240) NOT NULL,
  excerpt TEXT NULL,
  content LONGTEXT NOT NULL,
  featured_image_url VARCHAR(1000) NULL,
  status ENUM('DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  published_at DATETIME NULL,
  version INT UNSIGNED NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_blog_tenant_slug (business_id, slug),
  KEY idx_blog_tenant_status (business_id, status, published_at),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE RESTRICT
);
