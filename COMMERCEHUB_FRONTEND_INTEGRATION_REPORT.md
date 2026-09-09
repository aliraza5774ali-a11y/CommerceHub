# CommerceHub Frontend Integration Report

## 1. Existing Frontend Structure

The existing application is a Vite React 19 storefront template with Tailwind, Redux Toolkit, React Router, reusable storefront sections, modal authentication, and a cart presentation. It already contained a rudimentary Redux auth slice and placeholder dashboard components, but those used non-existent API paths and invalid route guards.

## 2. Changes Made

- Kept the existing storefront assets, sections, layout, styling, and responsive template for tenant home pages.
- Added platform-versus-store hostname handling using `VITE_PLATFORM_DOMAIN` and a backend-resolved tenant provider.
- Added a platform home with **Open a Store** and an exact store-owner registration form.
- Added tenant customer login and registration pages, role-based redirects, route guards, and customer/admin panels.
- Replaced scattered/incorrect auth wiring with a centralized Axios client, bearer token injection, refresh-and-retry flow, session restore via `/auth/me`, and logout cleanup.
- Added central API functions for the connected commerce modules.
- Configured Vite to listen on tenant development hosts and configured browser CORS support for credentialed cross-origin tenant requests.

## 3. Backend APIs Connected

- `POST /api/auth/register`, `/login`, `/refresh`, `/logout`; `GET /api/auth/me`
- `GET /api/domains/resolve`, `/domains`, `/settings`, `/analytics/overview`
- `GET/POST/PUT /api/catalog/products`; `POST /api/catalog/products/:id/publish`
- `GET/POST /api/inventory/:productId` operations as supported (`GET`, `POST /adjust`)
- `GET /api/admin/orders`, `/orders`, `/customers`, `/cart`, `/wishlist`
- Wishlist mutation helpers and public blog API helpers are centralized for subsequent UI use.

## 4. Multi-Tenant Flow

`localhost:5173` displays CommerceHub and opens `/open-store`. Registration sends the exact owner/store schema to the backend. The UI then displays `http://{storeSlug}.localhost:5173`. A tenant hostname is passed to the backend through its supported `domain` query parameter and resolved by `GET /domains/resolve`; the returned tenant is the only branding/context source.

## 5. Admin Panel

`/admin` requires an authenticated Owner, Admin, or Staff role returned by the backend. It displays real API results for overview, products, orders, customers, domains, and settings. The backend has no product delete endpoint and no inventory-list endpoint, so neither is represented as a fake control.

## 6. Customer Panel

`/account` requires authentication and shows the authenticated customer alongside live orders, wishlist, and cart responses. The backend has no customer self-service profile update endpoint; profile editing is not fabricated.

## 7. Authentication

Access/refresh tokens and current user are retained in local storage. Requests carry the access token; a single refresh request rotates/retries a failed request. Failed refresh clears session. Startup calls `/auth/me`. Logout posts the refresh token to `/auth/logout` then clears state.

## 8. Tenant Isolation

The frontend never sends a tenant ID. Store context comes from backend domain resolution; authenticated business-scoped calls use backend token tenant resolution. Login is now tenant-scoped when a store domain is supplied. Frontend lint and production build passed; the backend suite passed 17 tests (one opt-in MySQL suite skipped). Live database isolation scenarios were not run because no seeded backend/MySQL server was active in this workspace session.

## 9. Bugs Found

- Template used `/auth/signup`, absent from the backend.
- Auth guards were inverted/misspelled and role checks did not match backend `roleName`.
- Backend login looked up email globally despite the stated tenant login requirement.
- Public reviews resolved `req.hostname` (the API host), which fails when the frontend/API are on separate development hosts.
- Default CORS did not support credentialed tenant-origin browser requests.

## 10. Bugs Fixed

- Adapted auth client/forms to `/auth/register` and backend response envelopes.
- Corrected client route protection and backend-derived role checks.
- Scoped store login to resolved tenant; changed review public tenancy to the shared resolver, which honors `domain`.
- Enabled reflected-origin credential CORS.

## 11. Remaining Work

- **Backend missing:** public catalog/product endpoint; authenticated catalog APIs intentionally expose management data and cannot safely power an anonymous shop grid. Product deletion and an inventory-list endpoint are also absent.
- **Frontend missing:** richer CRUD forms/tables, product detail/review experience once the public catalog contract exists, and visualized reporting beyond raw, real API response panels.
- **Optional improvements:** httpOnly-cookie token architecture, automated browser E2E tests against seeded Ali Tech/Zee Scents tenants, and code splitting for the existing large template bundle.

## 12. Final Status

**PASS WITH MINOR ISSUES** — production build passes. Full runtime tenant-isolation tests remain pending an active seeded backend/MySQL environment.
