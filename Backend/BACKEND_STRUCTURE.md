# CommerceHub Backend Structure

The following tree excludes `node_modules` and local `.env` secrets.

```text
Backend/
|
|-- src/
|   |-- config/
|   |   `-- env.js
|   |
|   |-- database/
|   |   |-- connection.js
|   |   `-- migrations/
|   |       |-- 001_initial.sql
|   |       |-- 002_catalog_inventory.sql
|   |       |-- 003_core_commerce.sql
|   |       `-- 004_platform.sql
|   |
|   |-- middleware/
|   |   |-- auth.middleware.js
|   |   |-- authorize.middleware.js
|   |   |-- error.middleware.js
|   |   |-- platform.middleware.js
|   |   |-- tenant.middleware.js
|   |   `-- validation.middleware.js
|   |
|   |-- modules/
|   |   |-- analytics/
|   |   |   |-- analytics.repository.js
|   |   |   |-- analytics.routes.js
|   |   |   |-- analytics.service.js
|   |   |   `-- index.js
|   |   |-- audit-logs/
|   |   |   |-- audit.repository.js
|   |   |   |-- audit.routes.js
|   |   |   `-- index.js
|   |   |-- auth/
|   |   |   |-- auth.repository.js
|   |   |   |-- auth.routes.js
|   |   |   |-- auth.service.js
|   |   |   `-- index.js
|   |   |-- blog/index.js
|   |   |-- cart/
|   |   |   |-- cart.repository.js
|   |   |   |-- cart.routes.js
|   |   |   |-- cart.service.js
|   |   |   `-- index.js
|   |   |-- catalog/
|   |   |   |-- catalog.repository.js
|   |   |   |-- catalog.routes.js
|   |   |   `-- index.js
|   |   |-- cms/
|   |   |   |-- cms.repository.js
|   |   |   |-- cms.routes.js
|   |   |   |-- cms.service.js
|   |   |   `-- index.js
|   |   |-- customers/
|   |   |   |-- customer.repository.js
|   |   |   |-- customer.routes.js
|   |   |   `-- index.js
|   |   |-- domains/
|   |   |   |-- domain.repository.js
|   |   |   |-- domain.routes.js
|   |   |   `-- index.js
|   |   |-- integrations/index.js
|   |   |-- inventory/
|   |   |   |-- index.js
|   |   |   |-- inventory.repository.js
|   |   |   `-- inventory.routes.js
|   |   |-- media/
|   |   |   |-- index.js
|   |   |   |-- media.provider.js
|   |   |   |-- media.repository.js
|   |   |   `-- media.routes.js
|   |   |-- notifications/
|   |   |   |-- index.js
|   |   |   |-- notification.repository.js
|   |   |   |-- notification.routes.js
|   |   |   `-- notification.service.js
|   |   |-- orders/
|   |   |   |-- index.js
|   |   |   |-- order.repository.js
|   |   |   |-- order.routes.js
|   |   |   `-- order.service.js
|   |   |-- payments/
|   |   |   |-- index.js
|   |   |   |-- payment.gateway.js
|   |   |   |-- payment.repository.js
|   |   |   |-- payment.routes.js
|   |   |   `-- payment.service.js
|   |   |-- platform/
|   |   |   |-- index.js
|   |   |   `-- platform.routes.js
|   |   |-- promotions/
|   |   |   |-- index.js
|   |   |   |-- promotion.repository.js
|   |   |   |-- promotion.routes.js
|   |   |   `-- promotion.service.js
|   |   |-- reports/
|   |   |   |-- index.js
|   |   |   |-- report.repository.js
|   |   |   |-- report.routes.js
|   |   |   `-- report.service.js
|   |   |-- returns-refunds/
|   |   |   |-- index.js
|   |   |   |-- return.repository.js
|   |   |   |-- return.routes.js
|   |   |   `-- return.service.js
|   |   |-- reviews/index.js
|   |   |-- roles-permissions/index.js
|   |   |-- settings/
|   |   |   |-- index.js
|   |   |   |-- settings.repository.js
|   |   |   |-- settings.routes.js
|   |   |   `-- settings.service.js
|   |   |-- shipping/
|   |   |   |-- index.js
|   |   |   |-- shipping.repository.js
|   |   |   |-- shipping.routes.js
|   |   |   `-- shipping.service.js
|   |   |-- tax/
|   |   |   |-- index.js
|   |   |   |-- tax.repository.js
|   |   |   |-- tax.routes.js
|   |   |   `-- tax.service.js
|   |   |-- tenants/
|   |   |   |-- index.js
|   |   |   |-- tenant.repository.js
|   |   |   `-- tenant.routes.js
|   |   |-- themes/index.js
|   |   |-- users/index.js
|   |   `-- wishlist/index.js
|   |
|   |-- utils/
|   |   |-- apiResponse.js
|   |   |-- asyncHandler.js
|   |   |-- audit.js
|   |   |-- errors.js
|   |   `-- pagination.js
|   |
|   |-- app.js
|   |-- routes.js
|   `-- server.js
|
|-- test/
|   |-- health.test.js
|   |-- platform.test.js
|   `-- promotion.test.js
|
|-- docs/
|   |-- PHASE2.md
|   `-- PHASE3.md
|
|-- .env.example
|-- BACKEND_STRUCTURE.md
|-- CommerceHub_Module_Architecture_Codex.md
|-- package.json
|-- package-lock.json
`-- README.md
```

## Main API Layers

```text
Routes
  -> Middleware
  -> Services
  -> Repositories
  -> MySQL
```

## Main API Groups

```text
/api/auth
/api/tenants
/api/domains
/api/catalog
/api/inventory
/api/cart
/api/orders
/api/payments
/api/shipping
/api/returns
/api/promotions
/api/settings
/api/cms
/api/media
/api/customers
/api/notifications
/api/tax
/api/analytics
/api/reports
/api/audit-logs
/api/platform
```
