# CommerceHub Backend

Module-based multi-tenant CommerceHub API built with Node.js, Express, MySQL, and parameterized raw SQL.

## Run

1. Copy `.env.example` to `.env` and set MySQL/JWT values.
2. Create the database named by `DB_NAME`.
3. Apply `src/database/migrations/001_initial.sql` through `009_shipping_rates.sql` in order.
4. Run `npm install` and `npm run dev`.

Use `npm run migrate` to apply pending migrations and `npm run migrate:status` to inspect tracked migration state. The runner never resets data and rejects altered, already-applied migration files.

Health check: `GET /health`

Phase 3 platform APIs are mounted under `/api/settings`, `/api/cms`, `/api/media`, `/api/customers`, `/api/notifications`, `/api/tax`, `/api/analytics`, `/api/reports`, `/api/audit-logs`, and `/api/platform`. See [docs/PHASE3.md](docs/PHASE3.md) for the platform architecture and limitations.

Completion APIs include `/api/admin/orders`, `/api/roles`, `/api/wishlist`, `/api/reviews`, `/api/blog`, catalog management under `/api/catalog`, warehouse management under `/api/inventory`, and password reset under `/api/auth/forgot-password` and `/api/auth/reset-password`.

The API is organized by domain under `src/modules`. Tenant-owned queries must always include the resolved business context.

## Product publishing and inventory

Products are created as `draft`. A staff member publishes a completed draft using `POST /api/catalog/products/:id/publish`; this performs `draft → published` and creates its zeroed inventory record in one transaction. Publishing never adds stock. Use `POST /api/inventory/:productId/adjust` afterwards to add stock and make the published product purchasable.
