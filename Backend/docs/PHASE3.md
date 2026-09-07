# CommerceHub Phase 3

## Platform layer

Phase 3 adds tenant-scoped store management around the Phase 2 commerce engine:

- Settings and dynamic theme configuration with optimistic `version` updates.
- CMS pages and ordered JSON sections, draft/published workflow, revisions, and published storefront reads.
- Media metadata with a storage-provider boundary. The current provider stores references; it does not claim to upload files.
- Customer administration backed by existing users, orders, returns, and shipping address records.
- In-app notifications with unread counts and a safe email-provider boundary.
- Tax rules consumed by transactional checkout totals.
- MySQL analytics aggregations and report endpoints with JSON/CSV output.
- Tenant audit log query APIs and shared audit recording.
- Platform-admin tenant status management and tenant-admin domain management with primary-domain transactions.

## Migrations

Apply `001_initial.sql`, `002_catalog_inventory.sql`, `003_core_commerce.sql`, then `004_platform.sql` in order. The fourth migration adds settings, themes, CMS, revisions, media, notifications, tax rules, audit logs, platform-admin state, and domain-management fields/indexes.

## Authorization

Store operations use the authenticated tenant claim plus `resolveTenantFromAuth`. Staff mutations require Owner/Admin/Manager roles. Platform endpoints require the `isPlatformAdmin` JWT claim, populated from `users.is_platform_admin`. The schema intentionally does not expose a public platform-admin creation endpoint.

## CMS

Admin CMS APIs live under `/api/cms`. Storefront consumers use `GET /api/cms/storefront/:slug` with host-based tenant resolution, so draft pages are excluded. Sections are JSON-backed and constrained to supported section types. Page and section edits use version checks; publish/unpublish creates a revision and audit record.

## Analytics and reports

Analytics queries aggregate orders, order items, payments, and users with `business_id` and date predicates. Reports expose `/api/reports/{sales|orders|products|inventory|payments|returns|taxes}` and return CSV when `?format=csv` is provided. Large customer/notification/audit lists support `page` and `limit`.

## Limitations and assumptions

- Customer management uses the existing `users` table because Phase 1/2 did not create a separate customer table.
- Media upload bytes are outside the current API; clients provide a validated provider URL/reference until a real storage provider is configured.
- Email, SMS, and WhatsApp delivery are not faked. The email abstraction returns a not-configured result.
- Full MySQL migration and cross-tenant integration tests require configured database credentials and were not runnable in the current environment.
