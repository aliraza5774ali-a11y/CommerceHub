# CommerceHub Frontend Implementation Plan

## Backend Contract Baseline

The backend currently supports:

- Public products: `GET /catalog/public/products` and `GET /catalog/public/products/:slug`
- Cart: `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:itemId`, `DELETE /cart/items/:itemId`, and `DELETE /cart`
- Wishlist: `GET /wishlist`, `POST /wishlist`, `DELETE /wishlist/:productId`, and `DELETE /wishlist`
- Checkout and orders: `POST /orders`, `GET /orders`, `GET /orders/:id`, and `PATCH /orders/:id/cancel`
- Payments: `GET /payments/:id` and `POST /payments/:id/confirm`
- Domains: list, create, verify, set primary, and delete
- Settings: `GET /settings`, `PATCH /settings`, and `PATCH /settings/theme`
- Blog: public listing plus authenticated admin CRUD
- CMS: public storefront pages plus authenticated admin page/section CRUD
- Tenant resolution: `GET /domains/resolve`

The following require verification before implementation:

- Public product image/media fields
- Public tenant branding and theme configuration
- Store-slug availability checking
- Customer profile updates
- Guest cart and guest checkout
- Payment gateway completion behavior
- Role alignment: frontend recognizes `Staff`, while backend `requireStaff` recognizes `Manager`

## Phase 1 — Cleanup & Foundation

### Objective

Remove dead code, establish one frontend architecture, and make the repository independently verifiable.

### Tasks

1. Keep `RequireAuth` in `Frontend/src/pages/CommerceHubPages.jsx` as the authoritative route guard. Classify as frontend-only.
2. Consolidate the route-based and modal-based authentication implementations. Preserve refresh-token handling, `/auth/me`, and Owner-to-admin redirects. Classify as frontend-only.
3. Remove or formally deprecate unused `Frontend/src/components/protection/ProtectedRoute.jsx`, `AdminRoute.jsx`, and `Frontend/src/components/admin/AdminDashboard.jsx`. Classify as frontend-only.
4. Resolve existing ESLint errors in admin/account effects and unused imports. Classify as frontend-only.
5. Standardize shared API error and async-state handling where it reduces duplication. Classify as frontend-only.
6. Verify `App.jsx` continues to preserve `/admin`, owner-only admin routes, and `/account` guards. Classify as frontend-only verification.

### Files/components likely affected

- `Frontend/src/pages/CommerceHubPages.jsx`
- `Frontend/src/App.jsx`
- `Frontend/src/components/auth/*`
- `Frontend/src/features/auth/authThunks.js`
- `Frontend/src/components/protection/*`
- `Frontend/src/components/admin/AdminDashboard.jsx`
- Admin/account data components
- `Frontend/eslint.config.js`

### Existing functionality to preserve

- Login redirect: Owner to `/admin`, other authenticated users to `/account`
- Refresh-token retry and session bootstrap
- Tenant query-parameter injection
- Admin and owner-only route guards

### Dependencies

None.

### Testing requirements

- `npm run lint`
- `npm run build`
- Logged-out, customer, Admin/Staff, and Owner route tests

### Definition of Done

One authentication implementation is authoritative, dead files are removed or explicitly retained for a documented reason, lint/build pass, and route guards behave unchanged.

## Phase 2 — Platform / Store Creation

### Objective

Harden store creation using only backend-supported behavior.

### Tasks

1. Preserve the existing `/open-store` registration flow. Backend already supports this.
2. Match frontend validation to backend requirements: slug length, required names, normalized email, and password length. Frontend-only.
3. Improve duplicate-slug and validation error messages using actual backend error responses. Backend already rejects invalid/duplicate data; frontend handling is required.
4. Decide whether slug availability checking is required. Backend support must be verified first. If required, add a backend endpoint and then its frontend API method; do not invent the route.
5. Verify that the generated tenant URL resolves through `/domains/resolve`. Backend already supports tenant resolution.

### Files/components likely affected

- `Frontend/src/pages/CommerceHubPages.jsx`
- `Frontend/src/api/authApi.js`
- `Frontend/src/api/commerceApi.js`
- `Frontend/src/components/TenantProvider.jsx`
- Backend auth/domain routes only if availability checking is approved

### Existing functionality to preserve

- Platform-host routing
- Single-step store registration
- Store-created confirmation and tenant URL

### Dependencies

Phase 1.

### Testing requirements

- Registration validation tests
- Duplicate-slug response test
- Tenant-resolution test using the created slug
- Platform-host and tenant-host manual verification

### Definition of Done

A valid store can be created, invalid submissions show actionable errors, and availability checking is not presented unless backend support exists.

## Phase 3 — Real Tenant Storefront

### Objective

Replace mock product browsing with tenant-scoped public catalog data.

### Tasks

1. Refactor `Frontend/src/pages/Shops.jsx` to call `api.publicProducts()`. Backend already supports the endpoint.
2. Refactor `Frontend/src/pages/ProductDetails.jsx` to call `api.publicProduct(slug)`. Backend already supports the endpoint.
3. Add loading, empty, error, and not-found states. Frontend-only.
4. Normalize `id`, `name`, `slug`, `description`, `price`, and `salePrice`. Backend already returns these fields.
5. Verify whether public catalog responses include images/media. If not, retain a documented presentation fallback or add backend media support. Do not invent response fields.
6. Confirm every public request remains tenant-scoped through `Frontend/src/api/apiClient.js`. Frontend-only verification.

### Files/components likely affected

- `Frontend/src/pages/Shops.jsx`
- `Frontend/src/pages/ProductDetails.jsx`
- `Frontend/src/components/SampleProduct.jsx`
- `Frontend/src/components/sections/ProductSection.jsx`
- `Frontend/src/data/products.js`
- `Frontend/src/api/commerceApi.js`
- Backend catalog/media serializers only if required

### Existing functionality to preserve

- Existing product-card presentation
- Search/filter interaction where supported by returned fields
- Product slug navigation
- Responsive storefront styling

### Dependencies

Phase 1. Product IDs must be exposed before cart and wishlist actions are added.

### Testing requirements

- Public product success, empty, and error states
- Product-detail success and 404 states
- Tenant isolation tests across two tenant domains
- Responsive shop and detail-page checks

### Definition of Done

Shop and product-detail pages use published tenant products from the backend for core data and no longer depend on mock products as their primary source.

## Phase 4 — Product Shopping Experience

### Objective

Make product discovery and presentation accurate against the real catalog contract.

### Tasks

1. Rework category/filter logic around fields actually returned by the backend. Backend support must be verified because category is not currently in the public catalog response.
2. Use backend numeric price and sale-price values everywhere. Backend already supports these fields.
3. Define the product image strategy. Backend support must be verified; backend work is required if public media is needed but unavailable.
4. Add availability messaging only if public inventory data is supported. Backend support must be verified.
5. Preserve static trust, feature, and marketing sections where they are intentionally presentation content. Frontend-only decision.

### Files/components likely affected

- `Frontend/src/pages/Shops.jsx`
- `Frontend/src/pages/ProductDetails.jsx`
- `Frontend/src/components/SampleProduct.jsx`
- `Frontend/src/components/sections/ProductSection.jsx`
- Backend catalog/media serializers if required

### Existing functionality to preserve

- Current storefront visual language
- Product gallery behavior where assets exist
- Static trust and feature sections

### Dependencies

Phase 3 and decisions about categories, media, and public stock visibility.

### Testing requirements

- Product normalization tests
- Sale-price and missing-image cases
- Filter behavior against real response shapes

### Definition of Done

The storefront does not fabricate product attributes and accurately presents supported catalog data.

## Phase 5 — Cart & Wishlist

### Objective

Create one server-backed shopping state and connect storefront actions to it.

### Tasks

1. Add API methods matching existing cart routes: `cart`, `addCartItem`, `updateCartItem`, `removeCartItem`, and `clearCart`. Backend already supports these routes.
2. Add or repair a Redux cart slice so shared UI state is backed by the server. Frontend-only.
3. Replace the broken `state.cart` dependency in `Frontend/src/components/cart/CartSidebar.jsx`. Frontend-only.
4. Add add-to-cart controls to `Shops.jsx`, `ProductDetails.jsx`, and product cards. Frontend-only after product IDs are available.
5. Add storefront add/remove wishlist actions. Backend already supports wishlist mutation.
6. Add quantity, remove, clear, loading, and error states to `Frontend/src/components/account/AccountCart.jsx`. Frontend-only.
7. Decide whether unauthenticated users require a local cart. Backend cart routes require authentication, so guest behavior must be verified before implementation.

### Files/components likely affected

- `Frontend/src/api/commerceApi.js`
- `Frontend/src/store/index.js`
- New `Frontend/src/store/slice/cartSlice.js`
- `Frontend/src/components/cart/CartSidebar.jsx`
- `Frontend/src/components/SampleProduct.jsx`
- `Frontend/src/pages/Shops.jsx`
- `Frontend/src/pages/ProductDetails.jsx`
- `Frontend/src/components/account/AccountCart.jsx`
- `Frontend/src/components/account/AccountWishlist.jsx`

### Existing functionality to preserve

- Authenticated cart and wishlist pages
- Tenant-scoped API requests
- Existing wishlist removal behavior

### Dependencies

Phases 3 and 4. Checkout depends on a reliable cart state.

### Testing requirements

- Cart reducer tests
- Add/update/remove/clear API tests
- Wishlist add/remove tests
- Cart-sidebar synchronization tests
- Logged-out behavior tests

### Definition of Done

A customer can add products to the cart and wishlist, all cart surfaces display the same server-backed state, and no component reads a nonexistent Redux slice.

## Phase 6 — Checkout & Orders

### Objective

Complete the purchase journey from cart to order confirmation.

### Tasks

1. Add a frontend checkout API method for `POST /orders`. Backend already supports order creation.
2. Add a `/checkout` route and checkout page. Frontend-only.
3. Support the existing backend fields: `paymentMethod`, `currency`, optional `couponCode`, and optional `shippingMethodId`. Backend already supports these fields; response shape must be verified.
4. Send an idempotency key for order creation. Backend already reads the `idempotency-key` header.
5. Verify the payment response flow before integrating `POST /payments/:id/confirm`. Backend support exists, but gateway behavior must be verified.
6. Add order confirmation and failure states. Frontend-only.
7. Add order-detail and cancellation actions using existing backend routes. Backend already supports these routes.

### Files/components likely affected

- `Frontend/src/api/commerceApi.js`
- New `Frontend/src/pages/Checkout.jsx`
- New checkout components
- `Frontend/src/App.jsx`
- `Frontend/src/components/account/AccountOrders.jsx`
- `Frontend/src/components/account/AccountCart.jsx`
- `Frontend/src/api/apiClient.js`

### Existing functionality to preserve

- Existing order list and expandable details
- Backend checkout validation and inventory behavior
- Authenticated route protection

### Dependencies

Phase 5. Shipping, tax, promotions, and payment response contracts must be verified.

### Testing requirements

- Checkout success, validation failure, empty-cart, and duplicate-request tests
- Payment-confirmation failure tests
- Order-confirmation navigation tests
- Backend checkout integration tests

### Definition of Done

An authenticated customer can complete checkout, receive an order result, and view the resulting order without invented payment or shipping behavior.

## Phase 7 — Customer Panel

### Objective

Finish account workflows around orders, cart, profile, and sessions.

### Tasks

1. Add order-detail navigation or a detail view using `GET /orders/:id`. Backend already supports this.
2. Add order cancellation using `PATCH /orders/:id/cancel`. Backend already supports this.
3. Complete cart controls if unfinished in Phase 5. Frontend-only.
4. Verify profile-update requirements. No profile-update route currently exists, so backend support must be verified.
5. If profile editing is required, add a backend profile endpoint before adding frontend controls. Backend work required.
6. Preserve the current read-only profile behavior until update support exists.

### Files/components likely affected

- `Frontend/src/components/account/AccountLayout.jsx`
- `Frontend/src/components/account/AccountOrders.jsx`
- `Frontend/src/components/account/AccountCart.jsx`
- `Frontend/src/components/account/AccountProfile.jsx`
- `Frontend/src/api/commerceApi.js`
- Backend auth/users module if profile updates are approved

### Existing functionality to preserve

- Any-authenticated-user access to `/account`
- Existing orders, wishlist, cart, loading, empty, and error states
- Logout and session clearing

### Dependencies

Phases 1, 5, and 6.

### Testing requirements

- Account authorization tests
- Order detail and cancellation tests
- Cart mutation tests
- Profile read/update tests if backend support is added

### Definition of Done

Customers can manage carts, inspect and cancel eligible orders, and receive an explicit supported or unsupported profile-editing experience.

## Phase 8 — Admin Panel Completion

### Objective

Finish Domains and Settings using the backend write operations already available.

### Tasks

1. Add `createDomain`, `setPrimaryDomain`, `verifyDomain`, and `deleteDomain` API methods. Backend already supports all four.
2. Update `Frontend/src/components/admin/AdminDomains.jsx` with create, verify-token, primary-domain, delete, and conflict-error states. Frontend-only.
3. Add `updateSettings` and `updateTheme` API methods. Backend already supports both.
4. Convert `Frontend/src/components/admin/AdminSettings.jsx` from read-only display to editable forms with version handling. Frontend-only.
5. Verify frontend/backend role alignment. Frontend allows `Staff`; backend currently allows `Manager` instead. Backend work may be required.
6. Preserve owner-only route and navigation behavior for domains/settings unless authorization requirements are deliberately changed.

### Files/components likely affected

- `Frontend/src/api/commerceApi.js`
- `Frontend/src/components/admin/AdminDomains.jsx`
- `Frontend/src/components/admin/AdminSettings.jsx`
- `Frontend/src/components/admin/AdminLayout.jsx`
- `Frontend/src/pages/CommerceHubPages.jsx`
- Backend authorization middleware only if role mapping is incorrect

### Existing functionality to preserve

- Product CRUD, publishing, and inventory adjustment
- Admin overview, orders, and customers
- Owner-only domains/settings access

### Dependencies

Phase 1 and backend role verification.

### Testing requirements

- Domain CRUD and verification tests
- Settings/theme update tests
- Version-conflict tests
- Owner/Admin/Staff/Manager authorization tests

### Definition of Done

Domains and settings support the backend write operations with correct role enforcement and no fabricated endpoints.

## Phase 9 — CMS / Store Customization

### Objective

Connect tenant content and branding to the storefront using supported backend contracts.

### Tasks

1. Wire `Frontend/src/pages/Blog.jsx` to `api.blogPosts()`. Backend already supports public blog listing.
2. Add blog-detail routing only if a public detail endpoint is verified or added. Backend support must be verified first.
3. Add admin blog management only if required. Backend already supports admin blog CRUD.
4. Evaluate `GET /cms/storefront/:slug` for homepage, About, Contact, and other configurable pages. Backend already supports this endpoint.
5. Consume resolved tenant fields from `TenantProvider` for store name and branding. Frontend-only if the response contains the required fields.
6. Verify public theme/config support. Current theme updates are authenticated; a public theme endpoint may require backend work.
7. Never expose private settings or owner-only configuration through public storefront requests.

### Files/components likely affected

- `Frontend/src/pages/Blog.jsx`
- `Frontend/src/App.jsx`
- `Frontend/src/api/commerceApi.js`
- `Frontend/src/components/TenantProvider.jsx`
- `Frontend/src/components/layout/MainLayout.jsx`
- `Frontend/src/pages/Home.jsx`
- `Frontend/src/pages/About.jsx`
- `Frontend/src/pages/Contact.jsx`
- New CMS/admin blog components
- Backend CMS/theme serializers if public data is insufficient

### Existing functionality to preserve

- Static fallback content when CMS data is unavailable
- Tenant isolation
- Existing storefront layout and presentation

### Dependencies

Phases 1 and 3. Branding depends on the actual tenant/config response shape.

### Testing requirements

- Blog loading, empty, and error states
- CMS fallback behavior
- Tenant-branding isolation
- Public/private configuration access tests

### Definition of Done

Supported tenant content and branding render dynamically, while unsupported configuration remains explicitly deferred.

## Phase 10 — Final QA

### Objective

Validate the complete frontend against the actual repository and backend contracts.

### Tasks

1. Install dependencies from the complete frontend package and lockfile. Frontend-only.
2. Run `npm run lint` and `npm run build`. Frontend-only verification.
3. Run backend tests and migrations. Backend already provides test and migration scripts.
4. Execute end-to-end flows for tenant resolution, auth, products, product details, cart, wishlist, checkout, orders, domains, and settings.
5. Test loading, empty, error, unauthorized, forbidden, and expired-session states.
6. Test desktop, tablet, and mobile layouts.
7. Verify tenant isolation across at least two tenant hosts.
8. Search for remaining mock product usage and unused API methods.
9. Confirm every frontend endpoint has a matching backend route.

### Files/components likely affected

- Frontend test configuration and test files
- Backend test files
- `Frontend/README.md`
- Backend/frontend environment configuration

### Existing functionality to preserve

All completed authentication, tenant isolation, storefront, admin, and account behavior.

### Dependencies

All previous phases and a working MySQL-backed backend environment.

### Testing requirements

- Frontend lint
- Production build
- Backend unit and integration tests
- Browser/e2e tests
- Responsive visual checks
- Multi-tenant isolation tests
- Migration status verification

### Definition of Done

The repository builds cleanly, backend-supported flows work against a real session, multi-tenant isolation is verified with seeded data, and the primary customer and admin journeys pass end to end.
