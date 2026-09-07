# CommerceHub implementation status

Last updated: 2026-09-07

## Completed in the current implementation pass

- Product draft publishing with transactional inventory initialization.
- Checkout inventory deduction, rollback, and idempotency coverage.
- Shipment delivery to order delivery synchronization in one transaction.
- Active-cart uniqueness migration that permits historical converted carts.
- Permission loading into JWT claims, initial role-permission seed data, and catalog/inventory mutation protection.
- Refresh-token logout revocation endpoint: `POST /api/auth/logout`.
- Deterministic migration tracking and commands: `npm run migrate`, `npm run migrate:status`.
- Completion migration `008_completion.sql` adds password reset tokens, catalog hierarchy, variants/images, warehouse stock, reservations/transfers, order/payment/shipment/return histories, promotion applicability, wishlist, reviews, and blog persistence.
- Password reset endpoints with hashed single-use tokens and logout/session revocation.
- Roles/permissions APIs, admin order management, wishlist, verified-purchase reviews, tenant blog APIs, catalog management, warehouse management, promotion CRUD, domain verification, and shipping-rate-aware checkout.
- Staff ownership fixes for payment refunds, shipment progression, and return processing.

## Commands

From `Backend`:

```powershell
npm install
npm run migrate
npm run migrate:status
npm test
npm run dev
```

## Remaining work

Remaining work is concentrated in real provider/storage integrations, full return/payment atomic recovery, advanced product/category applicability, migration execution against XAMPP MySQL, and real MySQL-backed integration/concurrency/security tests. These are intentionally not marked complete merely because unit harness tests pass.
