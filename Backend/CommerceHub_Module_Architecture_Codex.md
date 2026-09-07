# CommerceHub Backend — Module-Based Architecture Specification

## 1. Purpose

Build the CommerceHub backend as a **module-based Node.js application** using:

- Node.js
- Express.js
- JavaScript (not TypeScript)
- MySQL
- Raw SQL queries (do not use Prisma or another ORM)
- Environment variables with `.env`
- REST APIs
- Clear separation between modules, controllers, services, repositories, routes, middleware, and database logic

The goal is to create a scalable, maintainable **multi-tenant e-commerce platform**.

Do not build this as one large `controllers/`, `services/`, or `routes/` directory containing everything. Each business domain must own its code inside its own module.

---

# 2. Core Architecture Principle

Use **domain/module-based architecture**.

Each major business capability gets its own module.

Recommended structure:

```text
src/
├── config/
├── database/
├── middleware/
├── utils/
├── app.js
├── server.js
│
└── modules/
    ├── auth/
    ├── tenants/
    ├── domains/
    ├── users/
    ├── roles-permissions/
    ├── catalog/
    ├── inventory/
    ├── customers/
    ├── cart/
    ├── wishlist/
    ├── orders/
    ├── payments/
    ├── shipping/
    ├── returns-refunds/
    ├── promotions/
    ├── reviews/
    ├── cms/
    ├── themes/
    ├── media/
    ├── blog/
    ├── notifications/
    ├── analytics/
    ├── reports/
    ├── audit-logs/
    └── integrations/
```

Every module should generally follow this internal structure:

```text
module-name/
├── controllers/
├── services/
├── repositories/
├── routes/
├── validators/
├── queries/
├── constants/
└── index.js
```

Only create folders that are actually needed by the module. Do not create meaningless empty layers just to satisfy a template.

---

# 3. Global Rules

## Database

Use MySQL.

Use raw SQL through the existing database connection/pool.

Do NOT introduce:

- Prisma
- Sequelize
- TypeORM
- Mongoose
- Any ORM

Keep SQL inside repositories or dedicated query files rather than directly inside controllers.

## Tenant Isolation

CommerceHub is a multi-tenant system.

Tenant-aware modules must always operate in the context of the resolved tenant/store.

The backend must never allow a request belonging to Tenant A to access Tenant B's records.

Use the tenant/business identifier consistently in database queries.

Example:

```sql
SELECT *
FROM products
WHERE id = ?
AND business_id = ?;
```

Never retrieve a tenant-owned resource only by ID when tenant isolation is required.

## Controllers

Controllers should:

- Read request data
- Call validators where appropriate
- Call services
- Return HTTP responses

Controllers should NOT contain complex business logic or large SQL queries.

## Services

Services contain business logic.

Examples:

- Creating an order
- Reserving stock
- Calculating discounts
- Initiating payment
- Processing refunds
- Publishing CMS content

## Repositories

Repositories communicate with MySQL.

They should contain:

- SELECT queries
- INSERT queries
- UPDATE queries
- DELETE queries
- Transaction-related database operations where appropriate

## Routes

Each module owns its routes.

Example:

```text
/api/auth/*
/api/products/*
/api/orders/*
/api/payments/*
```

Do not put all routes into one giant route file.

## Validation

Validate:

- Request body
- Params
- Query parameters
- IDs
- Amounts
- Status values
- Required fields

Never trust frontend validation.

## Error Handling

Use a centralized error-handling middleware.

Use consistent API responses.

Example:

```json
{
  "success": false,
  "message": "Product not found"
}
```

Successful responses can follow:

```json
{
  "success": true,
  "data": {}
}
```

---

# 4. The 25 Core Modules

Implement the following 25 modules.

---

## Module 1 — Authentication

Folder:

```text
src/modules/auth/
```

Responsibilities:

- Register
- Login
- Logout
- Access tokens
- Refresh tokens
- Refresh token rotation
- Password hashing
- Password reset
- Authentication middleware integration
- Current authenticated user

Expected routes:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

Authentication must work together with tenant/domain resolution.

---

# Module 2 — Tenants

Folder:

```text
src/modules/tenants/
```

Responsibilities:

- Store/business creation
- Tenant profile
- Tenant settings
- Tenant status
- Tenant isolation
- Store owner relationship

A tenant represents one independent store/business.

Example:

```text
Ali Tech
Zee Scents
CommerceHub Demo Store
```

---

# Module 3 — Domains

Folder:

```text
src/modules/domains/
```

Responsibilities:

- Custom domains
- Subdomains
- Domain registration
- Domain verification/status
- Domain-to-tenant resolution

Example:

```text
ali-tech.localhost -> Ali Tech
zeescents.localhost -> Zee Scents
```

The incoming hostname should resolve the correct tenant.

The architecture must support:

```text
custom-domain.com
store-name.platform-domain.com
```

without changing the core business modules.

---

# Module 4 — Users

Folder:

```text
src/modules/users/
```

Responsibilities:

- Admin users
- Managers
- Staff
- User profiles
- User status
- Tenant-user relationship

A user must belong to the appropriate tenant/business context.

---

# Module 5 — Roles & Permissions

Folder:

```text
src/modules/roles-permissions/
```

Responsibilities:

- Roles
- Permissions
- Role-permission assignment
- User-role assignment
- Authorization checks

Example roles:

```text
Owner
Admin
Manager
Staff
```

Example permissions:

```text
products.view
products.create
products.update
products.delete

orders.view
orders.update
orders.cancel

payments.view
payments.refund
```

Implement reusable authorization middleware.

---

# Module 6 — Catalog

Folder:

```text
src/modules/catalog/
```

Responsibilities:

- Products
- Categories
- Brands
- Attributes
- Variants
- Product images
- Product status
- SKU
- Barcode
- Product pricing

Support products with variants.

Example:

```text
T-Shirt
├── Black / Small
├── Black / Medium
├── Black / Large
├── White / Small
└── White / Large
```

Variant-level data should support:

- SKU
- Barcode
- Price
- Sale price
- Stock reference
- Images
- Attributes

Catalog must be tenant-aware.

---

# Module 7 — Inventory

Folder:

```text
src/modules/inventory/
```

Responsibilities:

- Stock
- Warehouses
- Stock adjustments
- Stock transfers
- Stock reservations
- Inventory history
- Low-stock detection

Important concurrency requirement:

Use appropriate database transactions and locking for critical inventory operations.

Understand and implement:

- Optimistic locking where appropriate
- Pessimistic locking where appropriate
- Transactions
- Stock reservation

Do not hold database locks while waiting for an external payment gateway.

Inventory operations must be atomic.

---

# Module 8 — Customers

Folder:

```text
src/modules/customers/
```

Responsibilities:

- Customer accounts
- Customer profiles
- Addresses
- Customer order history
- Customer status

Customers belong to a tenant/store.

A customer from Tenant A must never access Tenant B's customer data.

---

# Module 9 — Cart

Folder:

```text
src/modules/cart/
```

Responsibilities:

- Guest carts
- Customer carts
- Cart items
- Add item
- Update quantity
- Remove item
- Clear cart
- Cart totals
- Cart synchronization

Support conversion from guest cart to authenticated customer cart where appropriate.

Do not permanently trust prices received from the frontend.

Recalculate prices from backend/catalog data.

---

# Module 10 — Wishlist

Folder:

```text
src/modules/wishlist/
```

Responsibilities:

- Add product to wishlist
- Remove product
- View wishlist
- Prevent duplicates

Wishlist must be tenant-aware and customer-specific.

---

# Module 11 — Orders

Folder:

```text
src/modules/orders/
```

Responsibilities:

- Create orders
- Order items
- Order status
- Order timeline
- Order totals
- Cancellation
- Invoice references
- Order notes
- Partial/complete fulfillment support where needed

Suggested lifecycle:

```text
Pending
Confirmed
Processing
Packed
Shipped
Out for Delivery
Delivered
Cancelled
Returned
Refunded
```

Order creation must use database transactions.

Order totals must be calculated server-side.

Do not trust:

- Product price
- Discount amount
- Shipping amount
- Tax amount
- Final total

from the client.

---

# Module 12 — Payments

Folder:

```text
src/modules/payments/
```

This is a CORE module.

Responsibilities:

- Payment methods
- Payment initiation
- Payment intent/reference
- Gateway communication
- Payment verification
- Payment callbacks
- Webhooks
- Transaction records
- Payment status
- Refunds
- Reconciliation support
- Idempotency

Architecture:

```text
Payment Service
      │
      ├── COD
      ├── Gateway Adapter A
      ├── Gateway Adapter B
      └── Gateway Adapter C
```

The order module must not contain gateway-specific code.

Use a payment abstraction/interface pattern.

Example conceptual API:

```text
createPayment()
verifyPayment()
handleWebhook()
refundPayment()
```

The exact gateway can be configured later.

For the Pakistani market, keep the architecture ready for:

- Cash on Delivery
- Card payments
- Bank payments
- Local payment gateways

Do not hard-code one provider throughout the application.

## Payment Security

Never trust a frontend message such as:

```text
paymentStatus = "success"
```

The backend must verify payment using the gateway's server-side mechanism/webhook.

Use idempotency to prevent duplicate payments/orders when a request is retried.

---

# Module 13 — Shipping

Folder:

```text
src/modules/shipping/
```

Responsibilities:

- Shipping zones
- Shipping methods
- Shipping charges
- Delivery rules
- Courier integration
- Tracking number
- Shipment status

Support pricing strategies such as:

```text
Flat rate
Weight based
Location based
Quantity based
Free shipping
```

Shipping calculations must be performed by the backend.

---

# Module 14 — Returns & Refunds

Folder:

```text
src/modules/returns-refunds/
```

Responsibilities:

- Return requests
- Return reasons
- Return approval/rejection
- Return status
- Returned items
- Refund requests
- Refund processing
- Refund status

Example:

```text
Delivered
   ↓
Return Requested
   ↓
Approved
   ↓
Item Received
   ↓
Refund Processing
   ↓
Refunded
```

Refund processing must integrate with the Payments module.

Do not duplicate payment/refund logic inside Orders.

---

# Module 15 — Promotions

Folder:

```text
src/modules/promotions/
```

Responsibilities:

- Discounts
- Coupons
- Promotional campaigns
- Promotion rules
- Product/category-based discounts
- Minimum order rules
- Time-based promotions
- Percentage discounts
- Fixed discounts
- Free shipping promotions

Example:

```text
20% OFF
Orders above Rs. 5,000
```

Promotion calculations must happen server-side.

---

# Module 16 — Reviews

Folder:

```text
src/modules/reviews/
```

Responsibilities:

- Product ratings
- Written reviews
- Review images
- Verified purchase
- Review moderation
- Helpful votes
- Admin responses if required

Prevent unauthorized users from reviewing products they did not purchase if verified-purchase reviews are enabled.

---

# Module 17 — CMS

Folder:

```text
src/modules/cms/
```

Responsibilities:

- Pages
- Sections
- Hero sections
- Banners
- Testimonials
- FAQs
- Promotional content
- Content ordering
- Draft/published status

The CMS should allow admins to manage storefront content without modifying frontend source code.

Example:

```text
Home Page
├── Hero
├── Featured Products
├── Collection
├── Best Sellers
├── Testimonials
├── FAQ
└── Blog
```

Use a flexible section/content model.

---

# Module 18 — Themes

Folder:

```text
src/modules/themes/
```

Responsibilities:

- Theme settings
- Primary color
- Secondary color
- Background colors
- Typography
- Button styles
- Border radius
- Navbar configuration
- Footer configuration
- Layout settings

Theme data should be tenant-specific.

Example:

```text
Tenant A
Primary: #007f70

Tenant B
Primary: #000000
```

Do not hard-code tenant branding into React components.

---

# Module 19 — Media

Folder:

```text
src/modules/media/
```

Responsibilities:

- Product images
- CMS images
- Banners
- Videos
- File metadata
- Upload references
- Media deletion
- Media organization

Design the module so storage can later be switched between:

```text
Local storage
Cloud object storage
CDN
```

Do not couple business modules directly to one storage provider.

---

# Module 20 — Blog

Folder:

```text
src/modules/blog/
```

Responsibilities:

- Blog posts
- Categories
- Tags
- Authors
- Draft/published state
- Scheduled publishing if required
- Blog images

Support tenant-specific blog content.

---

# Module 21 — Notifications

Folder:

```text
src/modules/notifications/
```

Responsibilities:

- Email notifications
- SMS notifications
- WhatsApp integration readiness
- In-app notifications
- Notification templates
- Notification events
- Delivery status

Example events:

```text
Order Created
Payment Successful
Order Shipped
Order Delivered
Refund Completed
Password Reset
Low Stock
```

The notification module should be reusable by other modules.

Do not put email/SMS implementation directly inside Orders or Payments.

---

# Module 22 — Analytics

Folder:

```text
src/modules/analytics/
```

Responsibilities:

- Sales analytics
- Order analytics
- Product performance
- Customer analytics
- Revenue analytics
- Conversion-related metrics where data is available

Example dashboard metrics:

```text
Total Revenue
Total Orders
Average Order Value
New Customers
Returning Customers
Best Selling Products
```

Analytics queries must respect tenant isolation.

Avoid loading huge datasets into Node.js when aggregation can be performed efficiently in MySQL.

---

# Module 23 — Reports

Folder:

```text
src/modules/reports/
```

Responsibilities:

- Sales reports
- Inventory reports
- Order reports
- Payment reports
- Customer reports

Reports should support filtering such as:

```text
Date range
Product
Category
Order status
Payment status
```

Keep report generation separate from analytics APIs.

---

# Module 24 — Audit Logs

Folder:

```text
src/modules/audit-logs/
```

Responsibilities:

- Admin activity
- User activity
- Login history
- Resource changes
- Security-related events

Capture useful information such as:

```text
Actor
Tenant
Action
Resource
Resource ID
Timestamp
IP where appropriate
Before/after data where appropriate
```

Example:

```text
Admin Ali
Updated Product #124
09:42 AM
```

Do not store passwords, tokens, or other secrets in audit logs.

---

# Module 25 — Integrations

Folder:

```text
src/modules/integrations/
```

Responsibilities:

- External service integrations
- Payment provider configuration
- Shipping provider configuration
- Other external service adapters

This module should provide a clean integration boundary.

Important:

Payment business logic remains in:

```text
modules/payments/
```

Shipping business logic remains in:

```text
modules/shipping/
```

The integrations module should contain provider-specific adapters/configuration rather than becoming a dumping ground for all business logic.

---

# 5. Cross-Module Architecture

Modules should communicate through services/use cases rather than directly reaching into each other's repositories.

Example order flow:

```text
Customer
   ↓
Cart
   ↓
Checkout
   ↓
Orders
   ↓
Inventory Reservation
   ↓
Payments
   ↓
Payment Verification/Webhook
   ↓
Order Confirmation
   ↓
Notifications
```

Conceptually:

```text
Orders Service
      │
      ├── Cart Service
      ├── Inventory Service
      ├── Promotion Service
      ├── Shipping Service
      └── Payment Service
```

Avoid circular dependencies.

If two modules become tightly coupled, introduce a shared service, event mechanism, or application-level orchestration rather than allowing both modules to import each other's internals.

---

# 6. Important E-Commerce Concurrency Rules

CommerceHub must correctly handle concurrent requests.

## Optimistic Locking

Use where conflicts are relatively uncommon.

Good candidates:

```text
CMS editing
Product editing
Theme/settings editing
Admin-managed resources
```

Use a version column when appropriate:

```text
version = 1
```

Update condition:

```sql
UPDATE products
SET name = ?, version = version + 1
WHERE id = ?
AND business_id = ?
AND version = ?;
```

If affected rows are zero, report a conflict.

## Pessimistic Locking

Use when a resource must be protected during a critical transaction.

Good candidate:

```text
Inventory / stock
```

Typical MySQL approach:

```sql
SELECT stock
FROM inventory
WHERE product_id = ?
AND business_id = ?
FOR UPDATE;
```

Use inside a transaction.

Do not hold a database lock while waiting for external services.

---

# 7. Transactions

Use MySQL transactions for operations that must succeed or fail together.

Example order transaction:

```text
BEGIN
   ↓
Validate product/inventory
   ↓
Lock/reserve stock
   ↓
Calculate final order values
   ↓
Create order
   ↓
Create order items
   ↓
Create inventory reservation/change
   ↓
COMMIT
```

If a critical database operation fails:

```text
ROLLBACK
```

Keep external payment calls outside long-running database locks.

---

# 8. Payment + Order Architecture

Do not assume:

```text
Frontend says payment successful
        ↓
Create order
```

Instead:

```text
Checkout
   ↓
Create payment attempt
   ↓
Payment Gateway
   ↓
Gateway confirmation/webhook
   ↓
Backend verifies payment
   ↓
Idempotency check
   ↓
Confirm payment
   ↓
Confirm/finalize order
   ↓
Update inventory
   ↓
Notification
```

Exact ordering may vary depending on the payment provider, but payment confirmation must be server-trusted.

---

# 9. Idempotency

Implement idempotency for operations that may be retried.

Especially:

```text
Payment creation
Payment webhook processing
Order confirmation
Refund processing
```

If the same request/event arrives twice:

```text
Request ID: PAY-123
```

the backend should not create two payments or process the same refund twice.

---

# 10. Suggested Project Structure

Use this as the target structure:

```text
commercehub-backend/
│
├── src/
│   │
│   ├── config/
│   │   ├── env.js
│   │   └── appConfig.js
│   │
│   ├── database/
│   │   ├── connection.js
│   │   ├── migrations/
│   │   └── seeds/
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── tenant.middleware.js
│   │   ├── authorize.middleware.js
│   │   ├── error.middleware.js
│   │   └── validation.middleware.js
│   │
│   ├── utils/
│   │   ├── apiResponse.js
│   │   ├── errors.js
│   │   ├── logger.js
│   │   └── helpers.js
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── tenants/
│   │   ├── domains/
│   │   ├── users/
│   │   ├── roles-permissions/
│   │   ├── catalog/
│   │   ├── inventory/
│   │   ├── customers/
│   │   ├── cart/
│   │   ├── wishlist/
│   │   ├── orders/
│   │   ├── payments/
│   │   ├── shipping/
│   │   ├── returns-refunds/
│   │   ├── promotions/
│   │   ├── reviews/
│   │   ├── cms/
│   │   ├── themes/
│   │   ├── media/
│   │   ├── blog/
│   │   ├── notifications/
│   │   ├── analytics/
│   │   ├── reports/
│   │   ├── audit-logs/
│   │   └── integrations/
│   │
│   ├── routes.js
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── package.json
└── README.md
```

---

# 11. Module Internal Example

For a typical module such as Catalog:

```text
catalog/
├── controllers/
│   ├── product.controller.js
│   ├── category.controller.js
│   └── brand.controller.js
│
├── services/
│   ├── product.service.js
│   ├── category.service.js
│   └── brand.service.js
│
├── repositories/
│   ├── product.repository.js
│   ├── category.repository.js
│   └── brand.repository.js
│
├── routes/
│   ├── product.routes.js
│   ├── category.routes.js
│   └── brand.routes.js
│
├── validators/
│   └── product.validator.js
│
├── queries/
│   └── product.queries.js
│
└── index.js
```

Do not force every module to contain every folder.

---

# 12. Implementation Order

Do not attempt all 25 modules simultaneously.

Build them in dependency order.

## Phase 1 — Foundation

```text
1. Authentication
2. Tenants
3. Domains
4. Users
5. Roles & Permissions
```

## Phase 2 — Catalog & Inventory

```text
6. Catalog
7. Inventory
```

## Phase 3 — Customer Shopping

```text
8. Customers
9. Cart
10. Wishlist
```

## Phase 4 — Commerce Core

```text
11. Orders
12. Payments
13. Shipping
14. Returns & Refunds
15. Promotions
```

## Phase 5 — Store Experience

```text
16. Reviews
17. CMS
18. Themes
19. Media
20. Blog
```

## Phase 6 — Platform Operations

```text
21. Notifications
22. Analytics
23. Reports
24. Audit Logs
25. Integrations
```

---

# 13. What NOT to Add

Keep the current scope focused.

Do NOT add these as core modules:

```text
❌ Loyalty & Rewards
❌ AI-powered features
❌ Omnichannel Commerce
❌ SEO Management
```

They can be considered future extensions, but they are not part of the current 25-module architecture.

---

# 14. Coding Standards

Use:

- Clean JavaScript
- `async/await`
- ES modules if the existing project uses `"type": "module"`
- Meaningful function names
- Small focused functions
- Centralized error handling
- Parameterized SQL queries
- No SQL string concatenation with user input
- Environment variables for secrets/configuration
- Consistent HTTP status codes
- Consistent API response format

Never commit:

```text
.env
passwords
API secrets
JWT secrets
payment gateway secrets
database credentials
```

---

# 15. Codex Execution Instructions

When implementing this architecture:

1. First inspect the existing repository.
2. Do not overwrite working code unnecessarily.
3. Identify the current backend structure and reuse compatible infrastructure.
4. Establish the module structure first.
5. Establish database connection/configuration.
6. Establish global middleware.
7. Implement modules incrementally according to the phases above.
8. Keep every module isolated and tenant-aware.
9. Use raw MySQL queries.
10. Add migrations/schema changes in an organized way.
11. Add seed data only where useful.
12. Add API routes through each module.
13. Test each module before moving to the next.
14. Do not mark a module complete merely because folders were created.
15. A module is complete only when its required database operations, service logic, routes, validation, authorization, and tests are working.
16. Never silently change the architecture or introduce an ORM.
17. Do not add the excluded AI, Loyalty, Omnichannel, or SEO modules.
18. Keep payment gateway integration provider-agnostic.
19. Apply transactions, locking, and idempotency where required.
20. Maintain tenant isolation in every tenant-owned query.

---

# 16. Definition of Done

The backend architecture is considered successfully established when:

```text
✅ 25 modules exist
✅ Modules are independently organized
✅ Node.js + Express is used
✅ JavaScript is used
✅ MySQL is used
✅ Raw SQL is used
✅ No Prisma/ORM is introduced
✅ Tenant isolation is enforced
✅ Authentication works
✅ Authorization works
✅ Domain resolution works
✅ Catalog works
✅ Inventory concurrency is handled
✅ Cart works
✅ Orders use transactions
✅ Payments use a gateway abstraction
✅ Payment webhooks are verified server-side
✅ Idempotency is implemented for critical payment operations
✅ Shipping is separated from orders
✅ Returns/refunds are separated from payments/orders
✅ CMS is tenant-aware
✅ Themes are tenant-aware
✅ Notifications are reusable
✅ Analytics/reports are tenant-aware
✅ Audit logs are implemented
✅ External integrations have clear boundaries
```

The final result should be a **production-oriented, modular, multi-tenant CommerceHub backend foundation**, not merely a collection of folders.
