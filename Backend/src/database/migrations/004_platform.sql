ALTER TABLE businesses MODIFY status ENUM('active', 'suspended', 'pending', 'closed') NOT NULL DEFAULT 'active';
ALTER TABLE users ADD COLUMN is_platform_admin BOOLEAN NOT NULL DEFAULT FALSE AFTER status;
ALTER TABLE domains ADD COLUMN domain_type ENUM('subdomain', 'custom') NOT NULL DEFAULT 'subdomain' AFTER host;
ALTER TABLE domains ADD COLUMN is_primary BOOLEAN NOT NULL DEFAULT FALSE AFTER status;
ALTER TABLE domains ADD COLUMN verification_status ENUM('pending', 'verified', 'failed') NOT NULL DEFAULT 'verified' AFTER is_primary;
ALTER TABLE domains ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;
ALTER TABLE domains ADD KEY idx_domains_business_primary (business_id, is_primary);

CREATE TABLE store_settings (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL UNIQUE,
  store_name VARCHAR(160) NULL,
  store_description TEXT NULL,
  store_email VARCHAR(255) NULL,
  store_phone VARCHAR(40) NULL,
  currency CHAR(3) NOT NULL DEFAULT 'PKR',
  timezone VARCHAR(80) NOT NULL DEFAULT 'Asia/Karachi',
  country CHAR(2) NOT NULL DEFAULT 'PK',
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  order_settings JSON NULL,
  checkout_settings JSON NULL,
  shipping_settings JSON NULL,
  return_settings JSON NULL,
  notification_settings JSON NULL,
  version INT UNSIGNED NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);
CREATE TABLE store_themes (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL UNIQUE,
  primary_color VARCHAR(20) NOT NULL DEFAULT '#007f70',
  secondary_color VARCHAR(20) NOT NULL DEFAULT '#111827',
  accent_color VARCHAR(20) NOT NULL DEFAULT '#f59e0b',
  background_color VARCHAR(20) NOT NULL DEFAULT '#ffffff',
  text_color VARCHAR(20) NOT NULL DEFAULT '#111827',
  font_family VARCHAR(120) NOT NULL DEFAULT 'Inter',
  button_style VARCHAR(40) NOT NULL DEFAULT 'rounded',
  border_radius VARCHAR(20) NOT NULL DEFAULT '8px',
  version INT UNSIGNED NOT NULL DEFAULT 1,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);
CREATE TABLE cms_pages (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  slug VARCHAR(160) NOT NULL,
  title VARCHAR(200) NOT NULL,
  status ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
  version INT UNSIGNED NOT NULL DEFAULT 1,
  published_at DATETIME NULL,
  published_by BIGINT UNSIGNED NULL,
  created_by BIGINT UNSIGNED NOT NULL,
  updated_by BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_cms_page_tenant_slug (business_id, slug),
  KEY idx_cms_pages_tenant_status (business_id, status),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (published_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE RESTRICT
);
CREATE TABLE cms_sections (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  page_id BIGINT UNSIGNED NOT NULL,
  section_type VARCHAR(50) NOT NULL,
  position INT NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  content JSON NOT NULL,
  version INT UNSIGNED NOT NULL DEFAULT 1,
  created_by BIGINT UNSIGNED NOT NULL,
  updated_by BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_cms_sections_page_order (business_id, page_id, position),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (page_id) REFERENCES cms_pages(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE RESTRICT
);
CREATE TABLE cms_revisions (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  page_id BIGINT UNSIGNED NOT NULL,
  version INT UNSIGNED NOT NULL,
  snapshot JSON NOT NULL,
  changed_by BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_cms_revisions_page (business_id, page_id, version),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (page_id) REFERENCES cms_pages(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE RESTRICT
);
CREATE TABLE media (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  uploaded_by BIGINT UNSIGNED NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(1000) NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  file_size BIGINT UNSIGNED NOT NULL DEFAULT 0,
  alt_text VARCHAR(255) NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_media_tenant_created (business_id, created_at),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT
);
CREATE TABLE notifications (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  type VARCHAR(60) NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  data JSON NULL,
  read_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_notifications_recipient (business_id, user_id, read_at, created_at),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE tax_rules (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(120) NOT NULL,
  rate DECIMAL(8,4) NOT NULL,
  tax_type ENUM('percentage', 'fixed') NOT NULL DEFAULT 'percentage',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  version INT UNSIGNED NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_tax_rules_tenant_active (business_id, active),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);
CREATE TABLE audit_logs (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NULL,
  user_id BIGINT UNSIGNED NULL,
  action VARCHAR(80) NOT NULL,
  resource_type VARCHAR(80) NOT NULL,
  resource_id VARCHAR(80) NULL,
  metadata JSON NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_audit_tenant_time (business_id, created_at),
  KEY idx_audit_resource (business_id, resource_type, resource_id),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
