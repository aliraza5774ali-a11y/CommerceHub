# Storefront templates

Every storefront template lives under `src/templates/<name>/` and follows the
exact same folder shape, so picking, switching, or adding a template is
predictable no matter which one you're touching:

```
src/templates/<name>/
  <name>.css        # theme tokens: colors, fonts, shared utility classes
  layout/
    MainLayout.jsx   # <Outlet /> wrapper — mounts this template's Navbar/Footer
    <Name>Navbar.jsx
    <Name>Footer.jsx
  pages/
    Home.jsx
    Shops.jsx
    Collection.jsx
    About.jsx
    Contact.jsx
    Blog.jsx
    ProductDetails.jsx
  sections/          # (classic) or components/ + sections/ (others)
  data/              # dummy product + hero content (editorial/luxe/vibrant/texart)
```

## The five templates

| id         | label     | notes                                                              |
|------------|-----------|---------------------------------------------------------------------|
| `classic`  | Classic   | Original storefront; pulls live products via `api.publicProducts()` and CMS hero content via `useCmsHero()`. |
| `editorial`| Editorial | Magazine-style, warm palette. Standalone dummy data (`data/products.js`, `data/heroContent.js`). |
| `luxe`     | Luxe      | Quiet-luxury fashion. Standalone dummy data. |
| `vibrant`  | Vibrant   | Bold orange, high-energy. Standalone dummy data. |
| `texart`   | Texart    | Lime/violet check-shirt brand. Standalone dummy data. |

Classic is the only template still wired to the live storefront API/CMS —
it's the "real" storefront. The other four are self-contained showcases with
their own dummy catalogs, so they render identically regardless of what's in
the tenant's actual product catalog.

All five share only pure app mechanics, never content or styling:
- Redux cart state (`store/slice/cartSlice`) + cart drawer (`components/cart/CartSidebar`)
- Search modal (`components/searchModal`)
- Tenant name (`components/TenantProvider`) for the wordmark/brand name fallback

## How switching works

1. **`src/templates/registry.js`** — the single source of truth for the frontend.
   `TEMPLATES` maps a template id to its `layout` component and its 7 `pages`.
   `resolveTemplate(id)` falls back to `classic` for unknown ids.
2. **`src/templates/useActiveTemplate.js`** — reads `layoutTemplate` off
   `TenantProvider` (fetched from the backend, see below).
3. **`src/App.jsx`** — calls `resolveTemplate(useActiveTemplate())` and
   renders that template's `layout` + `pages` for all storefront routes.
   Admin and Account routes are never templated.
4. **Admin → Settings** — lets a store owner pick a template. It reads the
   list from `api.layoutTemplates()`, which is powered by the backend's
   `src/modules/themes/layout.templates.js` (`LAYOUT_TEMPLATES` map — id,
   label, description, preview image). Adding a template there is what makes
   it appear in the Settings picker.
5. **`src/pages/platform/OpenStorePage.jsx`** — `FALLBACK_TEMPLATES` is the
   offline fallback list shown during store signup if the backend call fails;
   keep it in sync with the backend list.

## Adding a sixth template

1. Create `src/templates/<name>/` following the folder shape above.
2. Register it in `src/templates/registry.js` (`TEMPLATES.<name> = { label, layout, pages }`).
3. Add it to `FALLBACK_TEMPLATES` in `src/pages/platform/OpenStorePage.jsx`.
4. Add it to `LAYOUT_TEMPLATES` in the backend's `src/modules/themes/layout.templates.js`
   so it shows up in Admin → Settings.
5. If it's a showcase template (not wired to live data), give it its own
   `data/products.js` + `data/heroContent.js` rather than importing another
   template's data or the shared CMS/API — keeps templates fully independent.
