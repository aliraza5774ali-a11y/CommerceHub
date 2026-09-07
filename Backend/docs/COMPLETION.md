# CommerceHub Completion Pass

This pass extends the Phase 1-3 modular monolith without changing the Node.js, Express, JavaScript, MySQL, mysql2, raw-SQL architecture.

## Added

- Password reset tokens: hashed, expiring, single-use, and refresh-session revocation.
- Roles and permissions CRUD plus transactional permission replacement.
- Categories, brands, attributes, variants, product images, warehouses, warehouse reservations, and stock tables.
- Staff order list/detail/status/notes/timeline APIs.
- Staff-safe tenant-scoped payment refunds, shipment transitions, and return decisions.
- Wishlist with unique tenant/customer/product constraint.
- Verified-purchase reviews.
- Tenant blog post administration and published storefront reads.
- Promotion list/detail/update/delete APIs.
- Domain verification tokens and verification endpoint.
- Shipping method rules and checkout shipping-fee integration.

## Migrations

Apply in order with the deterministic migration runner:

```powershell
npm run migrate
npm run migrate:status
```

New migrations:

- `008_completion.sql`
- `009_shipping_rates.sql`

## Validation

The unit and service suite passes 16 tests. The opt-in real MySQL API integration suite passes against the isolated `commercehub_test` database and covers registration, login/me, password reset, logout revocation, tenant isolation, catalog entities, product publication, inventory, cart, checkout, payment confirmation, idempotency, wishlist, settings, promotions, and staff order access.

Run it with:

```powershell
$env:MYSQL_INTEGRATION = '1'
$env:TEST_DB_NAME = 'commercehub_test'
npm run test:integration
```

The live `commercehub` database was inspected without destructive changes. It contains 50 tables and all migrations `001` through `009` are now reconciled in `schema_migrations`. A separate `commercehub_test` database was created and migrated from zero successfully. No external payment, email, SMS, WhatsApp, courier, or cloud media provider is simulated.
