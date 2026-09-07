# CommerceHub Module Implementation Audit

Audit scope: read-only inspection of the current `Backend` source tree, route registry, module routes/services/repositories, migrations, middleware, and tests. No source code, migration, or database data was modified.

## 1. Executive Summary

Total modules: **28**

Fully implemented: **0**

Partially implemented: **16**

Not implemented: **7**

Implemented but not tested: **5**

The backend is a working modular monolith for the main customer commerce path, but it does not yet meet the full requested module contracts. The strongest implemented path is catalog publication, inventory, cart, checkout, order creation, COD confirmation, shipping progression, CMS persistence, analytics aggregation, and report generation. The largest gaps are missing modules, incomplete authentication, incomplete catalog/domain/customer functionality, missing API integration coverage, and authorization predicates that prevent staff users from managing customer-owned payments, shipments, and returns.

Observed test result during audit: `npm test` passed **16/16** tests. Tests are predominantly dependency-injected service/unit harnesses; no MySQL-backed end-to-end suite was found.

## 2. Complete Module Matrix

Status meanings follow the requested classification. `Implemented but not tested` is used for a meaningful route/service/repository implementation where the repository contains no module-specific API/database integration test evidence. A module with major missing functionality remains `Partially implemented` even when some tests exist.

| Module | Folder | Routes | Service | Repository | DB Schema | Mounted | Tenant Isolation | Auth | Tests | Status |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| analytics | Yes | Yes | Yes | Yes | Yes, existing tables | Yes | Yes | Staff | Unit only | ⚠️ IMPLEMENTED BUT NOT TESTED |
| audit-logs | Yes | Yes | No dedicated service | Yes | Yes, `audit_logs` | Yes | Yes | Staff | No | 🟡 PARTIALLY IMPLEMENTED |
| auth | Yes | Yes | Yes | Yes | Yes, `users`, `refresh_tokens` | Yes | Tenant claim | Public/login + JWT | No direct auth tests | 🟡 PARTIALLY IMPLEMENTED |
| blog | Yes | No | No | No | No | No | No | No | No | 🔴 NOT IMPLEMENTED |
| cart | Yes | Yes | Yes | Yes | Yes, `carts`, `cart_items` | Yes | Yes | Customer JWT | Covered indirectly by checkout harness | ⚠️ IMPLEMENTED BUT NOT TESTED |
| catalog | Yes | Yes | Yes for publish only | Yes | Yes, `products` | Yes | Yes | JWT; mutation gaps | Publish unit tests | 🟡 PARTIALLY IMPLEMENTED |
| cms | Yes | Yes | Yes | Yes | Yes, CMS tables | Yes | Yes | Staff admin; public published read | No | ⚠️ IMPLEMENTED BUT NOT TESTED |
| customers | Yes | Yes | No dedicated service | Yes | Existing `users` plus commerce tables | Yes | Yes | Staff | No | 🟡 PARTIALLY IMPLEMENTED |
| domains | Yes | Yes | No dedicated service | Yes | Yes, `domains` | Yes | Yes | Public resolve; staff management | No | 🟡 PARTIALLY IMPLEMENTED |
| integrations | Yes | No | No | No | No provider tables | No | No | No | No | 🔴 NOT IMPLEMENTED |
| inventory | Yes | Yes | No dedicated service | Yes | Yes, `inventory`, movements | Yes | Yes | JWT; adjustment gap | Covered by catalog/checkout tests | 🟡 PARTIALLY IMPLEMENTED |
| media | Yes | Yes | No dedicated service | Yes | Yes, `media` | Yes | Yes | Staff mutation | No | 🟡 PARTIALLY IMPLEMENTED |
| notifications | Yes | Yes | Yes | Yes | Yes, `notifications` | Yes | Yes | Customer JWT | No | 🟡 PARTIALLY IMPLEMENTED |
| orders | Yes | Yes | Yes | Yes | Yes, `orders`, `order_items` | Yes | Yes | Customer JWT; no admin order routes | Checkout unit tests | 🟡 PARTIALLY IMPLEMENTED |
| payments | Yes | Yes | Yes | Yes | Yes, `payments` | Yes | Yes in SQL, but staff ownership bug | No direct payment test | 🟡 PARTIALLY IMPLEMENTED |
| platform | Yes | Yes | No separate service | Reuses tenant repository | Yes, businesses/user flag | Yes | Platform-wide by claim | Platform admin | No | 🟡 PARTIALLY IMPLEMENTED |
| promotions | Yes | Yes | Yes | Yes | Yes, promotions/usage | Yes | Yes | Staff create; JWT validate | Math unit tests only | 🟡 PARTIALLY IMPLEMENTED |
| reports | Yes | Yes | Yes | Yes | Existing commerce tables | Yes | Yes | Staff | CSV/date unit tests only | ⚠️ IMPLEMENTED BUT NOT TESTED |
| returns-refunds | Yes | Yes | Yes | Yes | Yes, `returns` | Yes | Yes in customer path; staff path bug | No direct return test | 🟡 PARTIALLY IMPLEMENTED |
| reviews | Yes | No | No | No | No | No | No | No | No | 🔴 NOT IMPLEMENTED |
| roles-permissions | Yes | No | No | No | Base role tables only | No | No | No reusable enforcement | No | 🔴 NOT IMPLEMENTED |
| settings | Yes | Yes | Yes | Yes | Yes, settings/themes | Yes | Yes | Staff mutation | No | ⚠️ IMPLEMENTED BUT NOT TESTED |
| shipping | Yes | Yes | Yes | Yes | Yes, addresses/methods/shipments | Yes | Yes in customer path; staff status bug | Customer + staff | Transition unit tests | 🟡 PARTIALLY IMPLEMENTED |
| tax | Yes | Yes | Yes | Yes | Yes, `tax_rules` | Yes | Yes | Staff | No | 🟡 PARTIALLY IMPLEMENTED |
| tenants | Yes | Yes | No dedicated service | Yes | Yes, `businesses` | Yes through tenant/platform routes | Yes | Auth/platform | No | 🟡 PARTIALLY IMPLEMENTED |
| themes | Yes | No separate routes/service/repository | No | No | Theme table exists, managed by settings | No separate route | Via settings | Via settings | No | 🔴 NOT IMPLEMENTED as standalone module |
| users | Yes | No | No | No | `users` exists | No | No standalone management | No | No | 🔴 NOT IMPLEMENTED |
| wishlist | Yes | No | No | No | No | No | No | No | No | 🔴 NOT IMPLEMENTED |

## 3. Fully Implemented Modules

None meet the strict audit definition of fully implemented across their requested scope, route/service/repository chain, persistence, authorization, and test evidence.

The following areas are materially implemented but are classified separately because their scope or integration evidence is incomplete:

- Cart has a usable tenant/user-scoped cart flow but lacks direct API/database tests.
- CMS has pages, JSON sections, ordering, publishing, revisions, and published storefront reads but lacks integration tests.
- Analytics and reports have real SQL aggregation and export code but no database-backed verification.
- Settings has tenant-scoped settings/theme persistence and optimistic updates but no integration tests.

## 4. Partially Implemented Modules

### auth

Implemented: registration, login, refresh-token rotation, hashed refresh-token persistence, `/me`, password hashing, JWT claims, and validation.

Missing: logout endpoint/session revocation API, forgot-password, reset-password, and direct authentication tests. `auth.routes.js` exposes only register, login, refresh, and me. The permission claim is not populated for `authorize()`; the token contains tenant, email, role, and platform-admin state but not permissions.

### catalog

Implemented: tenant-scoped product list/read/create/update, optimistic product versioning, draft-to-published transition, and inventory initialization during publish.

Missing: categories, brands, attributes, variants, product images, barcode, and broader catalog CRUD. Product create/update routes are not protected by `requireStaff`; only publish is staff-protected. The routes call the repository directly for most operations instead of consistently following route -> service -> repository.

### inventory

Implemented: tenant-scoped reads, initialization, row locking, atomic adjustment, movement history, and checkout deduction/restoration.

Missing: warehouses, transfers, explicit reservation lifecycle, low-stock API, and a service layer. The adjustment route requires authentication and tenant context but not staff authorization, so a normal authenticated user can reach an inventory mutation endpoint.

### orders

Implemented: transactional checkout, server-side product/price/stock checks, tax and promotion calculation, historical item snapshots, payment creation, inventory deduction, idempotency database constraint, customer order list/detail, cancellation, and status transition logic in the service.

Missing: mounted administrative order status endpoints, order timeline/notes/invoice support, complete fulfillment management, and direct database/API integration tests. The `idempotency()` validation helper is defined but never called; a missing `Idempotency-Key` is likely to reach the `NOT NULL` SQL field instead of the intended application error.

### payments

Implemented: payment records, payment states, COD gateway boundary, COD confirmation, provider rejection for unverified non-COD confirmation, and bounded partial/full refund calculation.

Missing: real provider webhooks/signature verification, provider adapters, reconciliation, refund idempotency API, and payment integration tests. The staff refund route passes the staff user's ID into repository queries that require `payments.user_id = currentUser`; staff users generally do not own customer payments, so refund operations appear functionally blocked for staff.

### shipping

Implemented: Pakistan-ready addresses, tenant methods, shipment creation, shipment lookup, lifecycle transitions, optimistic version checks, and transactional shipment-to-order delivery synchronization.

Missing: courier adapters, shipping calculation integration into checkout, admin shipment management that works across customer-owned orders, and shipping integration tests against MySQL. The staff status route has the same ownership problem as payments: repository queries require `orders.user_id = staffUserId`, so staff cannot normally update customer shipments.

### returns-refunds

Implemented: customer return creation/list/detail, delivered-order check, item/quantity validation, approval/rejection/receipt routes, payment refund call, and inventory restoration attempt.

Missing: return-window enforcement, duplicate/overlapping return quantity checks, customer/admin ownership separation, robust refund transaction boundary, and direct tests. Staff approval/receipt routes query returns and payments using the staff user ID, so staff likely cannot process customer returns. `receive()` performs several writes across separate calls/transactions and passes `undefined` as the inventory connection; refund and inventory restoration are not one atomic return transaction.

### promotions

Implemented: percentage/fixed coupon creation, active/time/minimum/usage/per-customer validation, maximum discount, tenant scoping, and checkout usage recording.

Missing: list/update/delete APIs, product/category applicability, free shipping, promotion administration completeness, and database concurrency integration tests. Only create is staff-protected; validation is customer-authenticated. The usage count and usage row operations are in checkout, but no unique constraint prevents duplicate usage rows for the same customer/order under all retry patterns.

### customers

Implemented: staff-only listing with search/status/pagination, profile read/update, order history, return history, and address history using existing tables.

Missing: a distinct customer model or role filter, phone filtering, registration date filters, payments/notifications view, and customer API tests. Listing all tenant users as customers can expose staff/admin accounts as customers.

### domains

Implemented: public host resolution, tenant domain listing, domain creation, primary-domain transaction, and non-primary deletion.

Missing: domain patch/status/verification endpoint, custom-domain verification workflow, platform/tenant domain policy, and domain tests. Domain management has no dedicated service layer. Public resolution uses only active host matching and does not enforce primary/verification semantics.

### inventory

The module is additionally affected by the fact that inventory mutations are exposed without staff authorization. See the authorization audit below.

### media

Implemented: tenant-scoped media metadata listing/create/delete, schema validation, and a storage provider abstraction.

Missing: actual file upload, storage deletion integration, local/cloud provider implementation, MIME/content validation, size enforcement, and media tests. The current reference provider only records a client-supplied URL; it is not an upload implementation.

### notifications

Implemented: tenant/user-scoped in-app create/list/read/read-all, unread count, pagination, and an email-provider boundary that explicitly reports not configured.

Missing: event integration from orders/payments/returns, templates, email/SMS/WhatsApp delivery, notification creation routes for authorized services, filtering, and tests.

### platform

Implemented: platform-admin claim, tenant list/detail, controlled tenant status transitions, transaction, and audit recording.

Missing: platform admin provisioning, platform configuration, paginated tenant listing, platform audit views, and tests. The platform-admin field must be migrated before the auth query can run against a fresh database.

### tax

Implemented: tenant-scoped tax rule list/create/update, active-rule calculation, validation, versioning, and checkout integration.

Missing: product/category applicability, tax jurisdictions, explicit tax report semantics, and tests. Multiple active rules are simply summed; no ordering or jurisdiction model exists.

### tenants

Implemented: registration-created tenant, authenticated `/api/tenants/me`, tenant repository, platform listing/status reuse, and status migration.

Missing: tenant profile/settings/status service and tenant-admin APIs. Tenant operations are split between tenant and platform routes rather than a complete tenant service.

### audit-logs

Implemented: shared audit insert utility, tenant-scoped filtered/paginated list/detail routes, and audit writes from settings, CMS, and platform status.

Missing: a dedicated service, broad event coverage across products/orders/payments/refunds/promotions/domains/customers, platform-wide audit query, and tests. Not every important operation is audited despite the module being mounted.

## 5. Not Implemented Modules

- **blog**: boundary index only; no routes, service, repository, tables, or tests.
- **integrations**: boundary index only; no provider configuration or adapters.
- **reviews**: boundary index only; no review/purchase verification implementation or schema.
- **roles-permissions**: only base `roles`, `permissions`, and `role_permissions` tables exist; no module routes/services/repositories or reusable permission assignment flow.
- **themes**: only a boundary index exists as a standalone module. Theme persistence is implemented inside `settings`, not under this module.
- **users**: only a boundary index exists as a standalone management module. Authentication reads users, and customer management reuses the table, but user administration is absent.
- **wishlist**: boundary index only; no schema, routes, service, repository, or tests.

## 6. Route Registration Audit

The application mounts these route trees in `src/routes.js`:

| Module | Method | Path | Handler/chain | Auth | Tenant | Staff/platform | Implemented |
|---|---|---|---|---|---|---|---|
| auth | POST | `/api/auth/register` | `authService.register` | No | No | No | Yes |
| auth | POST | `/api/auth/login` | `authService.login` | No | No | No | Yes |
| auth | POST | `/api/auth/refresh` | `authService.refresh` | No | No | No | Yes |
| auth | GET | `/api/auth/me` | `authService.me` | Yes | Claim only | No | Yes |
| tenants | GET | `/api/tenants/me` | `req.tenant` | Yes | Yes | No | Partial |
| domains | GET | `/api/domains/resolve` | `resolveTenant` | No | Host | No | Yes |
| domains | GET | `/api/domains` | `domainRepository.list` | Yes | Yes | Staff | Yes |
| domains | POST | `/api/domains` | `domainRepository.createDomain` | Yes | Yes | Staff | Yes |
| domains | PATCH | `/api/domains/:id/primary` | `domainRepository.setPrimary` | Yes | Yes | Staff | Yes |
| domains | DELETE | `/api/domains/:id` | `domainRepository.deleteDomain` | Yes | Yes | Staff | Partial |
| catalog | GET | `/api/catalog/products` | `catalogRepository.list` | Yes | Yes | No | Yes |
| catalog | GET | `/api/catalog/products/:id` | `catalogRepository.findById` | Yes | Yes | No | Yes |
| catalog | POST | `/api/catalog/products` | `catalogRepository.create` | Yes | Yes | No | Yes, authorization gap |
| catalog | POST | `/api/catalog/products/:id/publish` | `catalogService.publish` | Yes | Yes | Staff | Yes |
| catalog | PUT | `/api/catalog/products/:id` | `catalogRepository.update` | Yes | Yes | No | Yes, authorization gap |
| inventory | GET | `/api/inventory/:productId` | `inventoryRepository.get` | Yes | Yes | No | Yes |
| inventory | POST | `/api/inventory/:productId/adjust` | `inventoryRepository.adjust` | Yes | Yes | No | Yes, authorization gap |
| cart | POST | `/api/cart` | `cartService.get` | Yes | Yes | No | Yes |
| cart | GET | `/api/cart` | `cartService.get` | Yes | Yes | No | Yes |
| cart | POST | `/api/cart/items` | `cartService.add` | Yes | Yes | No | Yes |
| cart | PATCH | `/api/cart/items/:itemId` | `cartService.update` | Yes | Yes | No | Yes |
| cart | DELETE | `/api/cart/items/:itemId` | `cartService.remove` | Yes | Yes | No | Yes |
| cart | DELETE | `/api/cart` | `cartService.clear` | Yes | Yes | No | Yes |
| orders | POST | `/api/orders` | `orderService.checkout` | Yes | Yes | No | Yes |
| orders | GET | `/api/orders` | `orderService.list` | Yes | Yes | No | Yes |
| orders | GET | `/api/orders/:id` | `orderService.get` | Yes | Yes | No | Yes |
| orders | PATCH | `/api/orders/:id/cancel` | `orderService.cancel` | Yes | Yes | No | Yes |
| payments | GET | `/api/payments/:id` | `paymentService.get` | Yes | Yes | No | Yes for owner |
| payments | POST | `/api/payments/:id/confirm` | `paymentService.confirm` | Yes | Yes | No | Yes for COD owner |
| payments | POST | `/api/payments/:id/refund` | `paymentService.refund` | Yes | Yes | Staff | Broken staff ownership predicate |
| shipping | POST | `/api/shipping/addresses` | `shippingService.addAddress` | Yes | Yes | No | Yes |
| shipping | GET | `/api/shipping/addresses` | `shippingService.addresses` | Yes | Yes | No | Yes |
| shipping | GET | `/api/shipping/methods` | `shippingService.methods` | Yes | Yes | No | Yes |
| shipping | POST | `/api/shipping/methods` | `shippingService.createMethod` | Yes | Yes | Staff | Yes |
| shipping | GET | `/api/shipping/orders/:orderId/shipment` | `shippingService.get` | Yes | Yes | No | Yes for owner |
| shipping | POST | `/api/shipping/orders/:orderId/shipment` | `shippingService.createShipment` | Yes | Yes | No | Yes for owner |
| shipping | PATCH | `/api/shipping/shipments/:id/status` | `shippingService.transition` | Yes | Yes | Staff | Broken staff ownership predicate |
| returns-refunds | POST | `/api/returns/orders/:orderId/returns` | `returnService.create` | Yes | Yes | No | Yes for owner |
| returns-refunds | GET | `/api/returns` | `returnService.list` | Yes | Yes | No | Yes for owner |
| returns-refunds | GET | `/api/returns/:id` | `returnService.get` | Yes | Yes | No | Yes for owner |
| returns-refunds | PATCH | `/api/returns/:id/approve` | `returnService.decide` | Yes | Yes | Staff | Broken staff ownership predicate |
| returns-refunds | PATCH | `/api/returns/:id/reject` | `returnService.decide` | Yes | Yes | Staff | Broken staff ownership predicate |
| returns-refunds | PATCH | `/api/returns/:id/received` | `returnService.receive` | Yes | Yes | Staff | Broken staff ownership predicate |
| promotions | POST | `/api/promotions` | `promotionService.create` | Yes | Yes | Staff | Yes |
| promotions | POST | `/api/promotions/validate` | `promotionService.validate` | Yes | Yes | No | Yes |
| settings | GET | `/api/settings` | `settingsService.get` | Yes | Yes | No | Yes |
| settings | PATCH | `/api/settings` | `settingsService.update` | Yes | Yes | Staff | Yes |
| settings | PATCH | `/api/settings/theme` | `settingsService.updateTheme` | Yes | Yes | Staff | Yes |
| cms | GET | `/api/cms/storefront/:slug` | `cmsService.getPublishedBySlug` | No | Host | No | Yes |
| cms | GET | `/api/cms/pages` | `cmsService.listPages` | Yes | Yes | Staff | Yes |
| cms | POST | `/api/cms/pages` | `cmsService.createPage` | Yes | Yes | Staff | Yes |
| cms | GET | `/api/cms/pages/:id` | `cmsService.getPage` | Yes | Yes | Staff | Yes |
| cms | PATCH | `/api/cms/pages/:id` | `cmsService.updatePage` | Yes | Yes | Staff | Yes |
| cms | DELETE | `/api/cms/pages/:id` | `cmsService.deletePage` | Yes | Yes | Staff | Yes |
| cms | GET | `/api/cms/pages/:pageId/sections` | `cmsService.getPage` | Yes | Yes | Staff | Yes, returns page wrapper |
| cms | POST | `/api/cms/pages/:pageId/sections` | `cmsService.addSection` | Yes | Yes | Staff | Yes |
| cms | PATCH | `/api/cms/sections/:id` | `cmsService.updateSection` | Yes | Yes | Staff | Yes |
| cms | DELETE | `/api/cms/sections/:id` | `cmsService.deleteSection` | Yes | Yes | Staff | Yes |
| cms | PATCH | `/api/cms/sections/reorder` | `cmsService.reorder` | Yes | Yes | Staff | Yes |
| cms | POST | `/api/cms/pages/:id/publish` | `cmsService.publish` | Yes | Yes | Staff | Yes |
| cms | POST | `/api/cms/pages/:id/unpublish` | `cmsService.publish` | Yes | Yes | Staff | Yes |
| media | GET | `/api/media` | `mediaRepository.list` | Yes | Yes | No | Yes |
| media | POST | `/api/media` | `mediaRepository.create` | Yes | Yes | Staff | Yes, metadata only |
| media | DELETE | `/api/media/:id` | `mediaRepository.remove` | Yes | Yes | Staff | Yes, metadata only |
| customers | GET | `/api/customers` | `customerRepository.list` | Yes | Yes | Staff | Yes |
| customers | GET | `/api/customers/:id` | `customerRepository.find` | Yes | Yes | Staff | Yes |
| customers | PATCH | `/api/customers/:id` | `customerRepository.update` | Yes | Yes | Staff | Yes |
| customers | GET | `/api/customers/:id/orders` | `customerRepository.orders` | Yes | Yes | Staff | Yes |
| customers | GET | `/api/customers/:id/returns` | `customerRepository.returns` | Yes | Yes | Staff | Yes |
| customers | GET | `/api/customers/:id/addresses` | `customerRepository.addresses` | Yes | Yes | Staff | Yes |
| notifications | GET | `/api/notifications` | `notificationService.list` | Yes | Yes | No | Yes |
| notifications | PATCH | `/api/notifications/:id/read` | `notificationService.read` | Yes | Yes | No | Yes |
| notifications | PATCH | `/api/notifications/read-all` | `notificationService.readAll` | Yes | Yes | No | Yes |
| tax | GET | `/api/tax` | `taxService.list` | Yes | Yes | Staff | Yes |
| tax | POST | `/api/tax` | `taxService.create` | Yes | Yes | Staff | Yes |
| tax | PATCH | `/api/tax/:id` | `taxService.update` | Yes | Yes | Staff | Yes |
| analytics | GET | `/api/analytics/overview` | `analyticsService.overview` | Yes | Yes | Staff | Yes |
| analytics | GET | `/api/analytics/sales` | `analyticsService.sales` | Yes | Yes | Staff | Yes |
| analytics | GET | `/api/analytics/orders` | `analyticsService.orders` | Yes | Yes | Staff | Yes |
| analytics | GET | `/api/analytics/customers` | `analyticsService.customers` | Yes | Yes | Staff | Yes |
| analytics | GET | `/api/analytics/products` | `analyticsService.products` | Yes | Yes | Staff | Yes |
| analytics | GET | `/api/analytics/payments` | `analyticsService.payments` | Yes | Yes | Staff | Yes |
| reports | GET | `/api/reports/sales` | `reportService.get` | Yes | Yes | Staff | Yes |
| reports | GET | `/api/reports/orders` | `reportService.get` | Yes | Yes | Staff | Yes |
| reports | GET | `/api/reports/products` | `reportService.get` | Yes | Yes | Staff | Yes |
| reports | GET | `/api/reports/inventory` | `reportService.get` | Yes | Yes | Staff | Yes |
| reports | GET | `/api/reports/payments` | `reportService.get` | Yes | Yes | Staff | Yes |
| reports | GET | `/api/reports/returns` | `reportService.get` | Yes | Yes | Staff | Yes |
| reports | GET | `/api/reports/taxes` | `reportService.get` | Yes | Yes | Staff | Yes |
| audit-logs | GET | `/api/audit-logs` | `auditRepository.list` | Yes | Yes | Staff | Yes |
| audit-logs | GET | `/api/audit-logs/:id` | `auditRepository.find` | Yes | Yes | Staff | Yes |
| platform | GET | `/api/platform/tenants` | `tenantRepository.list` | Yes | No tenant restriction | Platform admin | Yes |
| platform | GET | `/api/platform/tenants/:id` | `tenantRepository.findById` | Yes | No tenant restriction | Platform admin | Yes |
| platform | PATCH | `/api/platform/tenants/:id/status` | `tenantRepository.updateStatus` + audit | Yes | No tenant restriction | Platform admin | Yes |

Missing module routes: blog, integrations, reviews, roles-permissions, themes as a standalone module, users, and wishlist.

## 7. Database Audit

### Migration 001: Foundation

| Module(s) | Tables | Tenant field | Important relationships/indexes | Sufficiency |
|---|---|---|---|---|
| tenants/domains | `businesses`, `domains` | `businesses` is tenant root; domains use `business_id` | Unique business slug and domain host; domain FK to business | Foundation exists; domain management fields arrive later |
| auth/users/roles-permissions | `users`, `refresh_tokens`, `roles`, `permissions`, `role_permissions` | Users use `business_id` | User role FK; unique email; token hash unique | Auth foundation exists; permission assignment and platform flag are incomplete in module terms |

### Migration 002: Catalog and inventory

| Module(s) | Tables | Tenant field | Important relationships/indexes | Sufficiency |
|---|---|---|---|---|
| catalog | `products` | `business_id` | Unique `(business_id, slug)`; product FK usage | Sufficient for basic products only; no variants/categories/brands/images |
| inventory | `inventory`, `inventory_movements` | Both use `business_id` | Inventory composite PK `(product_id, business_id)`; movement FKs | Sufficient for basic quantity/deduction/adjustment; no warehouses/transfers |

### Migration 003: Core commerce

| Module(s) | Tables | Tenant field | Important relationships/indexes | Sufficiency |
|---|---|---|---|---|
| cart | `carts`, `cart_items` | Both use `business_id` | Active-cart unique key after migration 006; product/cart FKs | Basic authenticated cart sufficient; no guest/customer merge |
| promotions | `promotions`, `promotion_usages` | Both use `business_id` | Unique `(business_id, code)`; usage/customer index | Basic coupon limits; no product/category eligibility or unique usage invariant |
| orders | `orders`, `order_items` | Both use `business_id` | Unique order number; unique `(business_id,user_id,idempotency_key)`; order indexes | Core checkout/order snapshot exists; no timeline/notes/fulfillment model |
| payments | `payments` | Yes | Unique payment idempotency key; order index/FK | Basic payment/COD state exists; no provider webhook/reconciliation tables |
| shipping | `shipping_addresses`, `shipping_methods`, `shipments` | All use `business_id` | Unique `(business_id,order_id)` shipment; status index; order/address/method FKs | Basic shipping lifecycle exists; no courier integration/configuration |
| returns-refunds | `returns` | Yes | Tenant/user/order indexes; order/item/user FKs | Basic return rows exist; return window and refund transaction rules are absent |

### Migration 004: Platform

| Module(s) | Tables/changes | Tenant field | Important relationships/indexes | Sufficiency |
|---|---|---|---|---|
| platform/tenants/domains | businesses status extension, `users.is_platform_admin`, domain fields/index | Root business/domain fields | Primary-domain index; no unique active-primary constraint | Basic status/primary operations exist; platform model is minimal |
| settings/themes | `store_settings`, `store_themes` | Unique `business_id` | One settings/theme record per tenant; version columns | Basic settings/theme persistence exists |
| cms | `cms_pages`, `cms_sections`, `cms_revisions` | All use `business_id` | Page slug unique per tenant; section order index; user FKs | Basic page/section/publish model exists |
| media | `media` | Yes | Tenant-created index; uploader FK | Metadata only; no storage object lifecycle |
| notifications | `notifications` | Yes | Recipient/read/time composite index; user FK | In-app persistence exists; no delivery/event tables |
| tax | `tax_rules` | Yes | Tenant/active index; version | Basic rules only; no product/category applicability |
| audit-logs | `audit_logs` | Nullable for platform/global records | Tenant/time and resource indexes; user FK | Query/write foundation exists; event coverage incomplete |

### Migrations 005 and 006

- `005_product_publish_status.sql` changes product lifecycle to `draft`, `published`, `archived` and converts legacy `active` records to `published`.
- `006_active_cart_uniqueness.sql` adds a generated active-user key so historical converted carts do not conflict with the one-active-cart invariant.

Potential migration concern: `004_platform.sql` assumes it runs after the original `001_initial.sql` definition and adds `is_platform_admin`; fresh migrations must be applied strictly in order. The source code expects the post-migration schema, not the original schema alone.

## 8. Tenant Isolation Audit

| Area | Finding |
|---|---|
| Catalog | Product queries consistently include `business_id`; product create/update/publish use resolved authenticated tenant. |
| Inventory | Reads, locks, adjustments, deductions, restorations, and movements include `business_id`. |
| Cart | Cart and cart-item queries include tenant and user ownership; product lookup joins tenant-aware inventory. |
| Orders | Customer order queries include tenant and user; checkout locks products/inventory by tenant; item queries include tenant. |
| Payments | Queries include tenant and user, which protects customer access but incorrectly prevents staff administration. |
| Shipping | Customer-facing address/order/shipment queries include tenant and user; staff status management inherits the ownership bug. |
| Promotions | Coupon and usage queries include tenant; promotion usage lacks a database uniqueness constraint for per-order/customer duplication. |
| Customers | All customer repository queries include `business_id`; customer identity is reused from users. |
| Returns | Customer queries include tenant/user; staff approval/refund queries also require staff user ownership and therefore are likely unusable for customer records. |
| CMS | Page, section, revision, and published-slug queries include tenant; public published read resolves tenant from host. |
| Settings/themes | Settings/theme repositories use tenant `business_id`. |
| Analytics/reports | Aggregation queries include tenant filters and date predicates. |
| Notifications | Recipient queries require both tenant and user. |
| Audit logs | Tenant list/detail queries require `business_id`; platform audit is not exposed. |
| Domains | Tenant domain management filters `business_id`; public host lookup resolves business through domain. |
| Missing modules | Blog, reviews, wishlist, users, and roles-permissions have no usable tenant-scoped implementation. |

## 9. Authentication & Authorization Audit

### No authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/domains/resolve`
- `GET /api/cms/storefront/:slug`

### Customer/authenticated user

Cart, customer order list/detail/cancel, payment read/confirm, shipping addresses, customer shipment lookup/create, return create/list/detail, promotion validation, notifications, and settings read use JWT plus authenticated tenant context.

### Staff/admin

CMS administration, media mutations, customer management, tax, analytics, reports, audit logs, promotion creation, settings/theme mutations, shipping method creation, payment refunds, shipment status, and return decisions use `requireStaff` in routes.

Important authorization findings:

1. `authorize()` exists but no visible route uses it, and JWT claims do not contain permissions.
2. Catalog product create/update and inventory adjustment are authenticated but not staff-protected.
3. Staff payment/shipment/return operations pass the staff user ID into repositories whose SQL requires the resource owner user ID.
4. Platform routes use the separate `isPlatformAdmin` claim and are not tenant-scoped by design.
5. There is no standalone users/roles/permissions management API.

## 10. Test Coverage

`package.json` exposes only `npm test`, running Node's test runner.

| Test | Coverage |
|---|---|
| `catalog.publish.test.js` | Catalog publish lifecycle, tenant mismatch, inventory initialization, rollback |
| `order.checkout.inventory.test.js` | Checkout deduction, tenant isolation in harness, rollback, idempotency |
| `shipping.transition.test.js` | Shipment lifecycle, order delivery synchronization, rollback |
| `health.test.js` | Express health endpoint |
| `promotion.test.js` | Percentage/fixed discount calculation only |
| `platform.test.js` | Analytics date range and CSV serialization only |

No direct database-backed API tests were found. No tests cover migrations, authentication, tenant domain resolution, cart endpoints, payment routes, returns, CMS persistence, media, notifications, settings, tax, customer management, audit queries, platform admin, or tenant isolation against a real MySQL database.

The audit run observed: **16 passed, 0 failed**.

### Manually verified flows supported by source

The source supports the manually verified flows listed in the request for authentication, tenant resolution, catalog/product publication, inventory, cart, checkout/order creation, order listing/details/cancellation, inventory restoration on cancellation, COD payment confirmation, shipping, shipment progression, and shipment-to-order delivery synchronization. These should not be treated as automated test evidence; only the six test files above are automated evidence.

## 11. Broken or Suspicious Areas

1. **Staff ownership predicate mismatch:** payments, shipments, and returns repositories filter by `user_id = current authenticated user`. Staff routes then pass the staff user ID, so staff administration of customer resources is likely blocked.
2. **Unused idempotency validator:** `orderService` defines `idempotency()` but `checkout()` never calls it. Missing checkout keys can reach a non-null database column.
3. **Incomplete auth contract:** logout, forgot-password, reset-password, and explicit refresh-session logout are absent.
4. **Permission middleware is disconnected:** `authorize()` checks `req.auth.permissions`, but token creation does not populate permissions and no route uses this middleware.
5. **Mutation authorization gaps:** product create/update and inventory adjustment do not require staff authorization.
6. **Return transaction boundary:** return receipt, refund, inventory restoration, and status updates are not one transaction; `receive()` passes `undefined` for the inventory connection and calls payment refund separately.
7. **Refund flow lacks provider invocation:** `paymentService.refund()` changes local payment state but does not call a provider gateway.
8. **Payment currency omission:** order payment insertion does not receive/store the order currency in the current repository method, despite the payments table having a currency field.
9. **Order status administration is unreachable:** `orderService.transition()` exists, but no order route exposes it and no staff order-management route is mounted.
10. **Shipping fees are not part of checkout:** shipping methods exist, but checkout always uses `shipping: 0`; shipping is created after the order instead of being calculated into the order total.
11. **CMS sections endpoint shape:** `GET /api/cms/pages/:pageId/sections` calls `getPage()` and returns the complete page wrapper rather than a section-only response.
12. **CMS reorder scope:** reorder accepts section IDs and tenant ID but does not verify all IDs belong to the same page; it can reorder sections across pages within one tenant.
13. **Customer model conflation:** customer management treats every tenant user as a customer and has no customer role/type filter.
14. **Domain primary constraint:** the schema has an index but no unique constraint guaranteeing one primary domain; application transaction logic is the only protection.
15. **Domain verification:** custom domains are inserted with `verification_status = pending`, but no verification workflow exists.
16. **Media is metadata-only:** clients submit a URL; no upload, content inspection, storage provider selection, or object deletion is implemented.
17. **Notifications are not integrated:** order/payment/return actions do not visibly call notification service creation.
18. **Analytics date semantics:** the default range subtracts one day unless a supported period is supplied; `today`, `yesterday`, `90d`, and arbitrary custom date validation are not fully modeled.
19. **Report filters are narrow:** most report routes support only date range; requested product/category/customer/status/payment filters are not implemented.
20. **Audit coverage is narrow:** many important mutations do not call `recordAudit`.
21. **Standalone module placeholders:** seven requested modules contain boundary exports only and no functional implementation.
22. **No migration runner:** migrations exist as SQL files, but no migration execution command or tracking table is present in `package.json` or source.
23. **No real MySQL test environment evidence:** all meaningful tests use dependency injection or pure functions; schema compatibility and SQL behavior remain unverified by the test suite.

## 12. Recommended Implementation Order

1. Fix authorization ownership boundaries for staff payment, shipment, and return operations without weakening tenant filters.
2. Complete authentication: logout/revocation endpoint, forgot-password, reset-password, permissions loading, and auth integration tests.
3. Add a migration runner and execute all six migrations against XAMPP MySQL in a disposable development database.
4. Add MySQL-backed tenant-isolation/API tests for cart, checkout, payments, shipping, returns, CMS, settings, and reports.
5. Complete catalog and inventory administration: staff authorization, variants, categories, brands, warehouses, transfers, and explicit reservation lifecycle.
6. Complete order administration and shipping-cost integration before expanding reporting.
7. Complete returns/refunds as one transaction with provider abstraction and idempotent refund records.
8. Finish customers, domains, settings, tax applicability, notifications/events, audit coverage, and report filters.
9. Implement roles-permissions/users/platform provisioning, then wishlist, reviews, blog, and integrations according to product priority.

## 13. Final Status

IMPLEMENTED:

- Core raw-SQL modular Express architecture.
- Tenant-aware catalog publication and inventory operations.
- Authenticated cart and transactional checkout/order creation.
- Basic payment/COD state handling.
- Shipping addresses, methods, shipment lifecycle, and delivery synchronization.
- Basic promotions, CMS, settings/theme persistence, media metadata, notifications, tax, analytics, reports, and audit querying.

PARTIAL:

- Auth, catalog, inventory, orders, payments, shipping, returns/refunds, promotions, customers, domains, media, notifications, tax, audit logs, platform administration, and tenants.
- These modules have concrete code but missing requested features, incomplete service boundaries, authorization gaps, or incomplete operational workflows.

NOT IMPLEMENTED:

- Blog, integrations, reviews, roles-permissions, standalone themes, standalone users, and wishlist.

IMPLEMENTED BUT NOT TESTED:

- Cart, CMS, analytics, reports, and settings have meaningful implementation and routes but no direct MySQL/API integration test evidence.

NEXT PRIORITY:

- Correct the staff/customer ownership boundary for payments, shipments, and returns; enforce staff authorization on catalog/inventory mutations; complete auth session/password flows; add a migration runner and real MySQL integration/tenant-isolation tests.
