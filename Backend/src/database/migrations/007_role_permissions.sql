INSERT INTO permissions (name) VALUES
  ('catalog.read'), ('catalog.create'), ('catalog.update'), ('catalog.delete'),
  ('inventory.read'), ('inventory.adjust'), ('orders.read'), ('orders.update'),
  ('payments.read'), ('payments.refund'), ('shipping.read'), ('shipping.manage'),
  ('returns.read'), ('returns.approve'), ('returns.reject'), ('customers.read'),
  ('customers.update'), ('promotions.manage'), ('cms.manage'), ('media.manage'),
  ('settings.manage'), ('reports.read'), ('analytics.read'), ('users.manage'), ('roles.manage')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.name IN ('Owner', 'Admin');

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.name IN (
  'catalog.read', 'catalog.create', 'catalog.update', 'inventory.read', 'inventory.adjust',
  'orders.read', 'orders.update', 'payments.read', 'shipping.read', 'shipping.manage',
  'returns.read', 'returns.approve', 'returns.reject', 'customers.read', 'customers.update',
  'promotions.manage', 'cms.manage', 'media.manage', 'settings.manage', 'reports.read', 'analytics.read'
) WHERE r.name = 'Manager';
