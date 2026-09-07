# CommerceHub Phase 2

## Modules

- Cart: authenticated, tenant-scoped carts with server-side product prices and inventory checks.
- Orders: transactional checkout, immutable line-item snapshots, order numbers, cancellation, and idempotency keys.
- Payments: payment state machine, COD confirmation, provider-neutral gateway boundary, and bounded refunds.
- Shipping: Pakistan-ready addresses, tenant shipping methods, shipment lifecycle, and optimistic status updates.
- Promotions: percentage/fixed coupons, time windows, minimum totals, global and per-customer usage limits.
- Returns: delivered-order item validation, approval/rejection, receipt, refund integration, and inventory restoration.

## Migrations

Apply migrations in order:

1. `001_initial.sql`
2. `002_catalog_inventory.sql`
3. `003_core_commerce.sql`
4. `004_platform.sql`
5. `005_product_publish_status.sql`
6. `006_active_cart_uniqueness.sql`

The third migration adds carts, cart items, promotions, promotion usage, orders, order items, payments, shipping addresses, shipping methods, shipments, and returns. Every commerce table carries `business_id` and has tenant-oriented indexes.

## Checkout

`POST /api/orders` requires an `Idempotency-Key` header. The service locks each product and inventory row in one MySQL transaction, revalidates published status and price, validates the coupon while the promotion row is locked, deducts inventory quantity, snapshots order items, creates a pending payment, records promotion usage, and converts the cart.

Prices, discounts, stock, payment state, user ID, and tenant ID are never accepted as trusted checkout inputs. Shipping is currently zero until a tenant shipping method is selected by the shipping workflow.

## Product lifecycle

`POST /api/catalog/products` creates a `draft` product. Staff publish a completed draft through `POST /api/catalog/products/:id/publish`. The publish transaction locks the tenant-scoped product, validates its draft state and prices, changes it to `published`, increments its version, and initializes its inventory row with `quantity = 0`, `reserved_quantity = 0`, and `version = 1`. An existing inventory row is retained. Stock is added separately through `POST /api/inventory/:productId/adjust`.

## Concurrency and idempotency

- Inventory uses `SELECT ... FOR UPDATE` inside checkout and stock adjustment transactions. Checkout immediately deducts `quantity` and leaves `reserved_quantity` at zero; cancellation and returns restore `quantity`.
- Product edits retain the existing version-based optimistic locking.
- Shipment updates require the current version.
- Checkout uses `(business_id, user_id, idempotency_key)` uniqueness.
- Promotion rows are locked while usage limits are checked and consumed.
- Refresh tokens remain hashed and rotating from Phase 1.

## Payment assumptions

COD is implemented as a pending manual payment that can be confirmed by the authenticated order owner. Card, bank, and gateway methods deliberately reject client-side confirmation until a provider adapter and verified webhook/signature configuration are supplied. No fake external success response is generated.

## Testing

Run `npm test` for the health and promotion unit checks. Run the syntax check from the repository root with `Get-ChildItem -Recurse -Filter *.js src | ForEach-Object { node --check $_.FullName }`.
