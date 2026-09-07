ALTER TABLE shipping_methods ADD COLUMN description VARCHAR(255) NULL, ADD COLUMN minimum_order DECIMAL(12,2) NULL, ADD COLUMN maximum_order DECIMAL(12,2) NULL, ADD COLUMN estimated_delivery VARCHAR(80) NULL;
ALTER TABLE domains ADD COLUMN verification_token CHAR(64) NULL, ADD COLUMN verified_at DATETIME NULL, ADD UNIQUE KEY uq_domain_verification_token (verification_token);
