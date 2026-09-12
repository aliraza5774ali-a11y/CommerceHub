# Storefront templates — status

## What this is
A genuinely different full storefront design ("Editorial") that a tenant can switch
to instead of the original ("Classic") — different layout, sections, and typography,
not just colors. Distinct and separate from the older color/font preset system
(`store_themes` / `theme_id`).

## Backend
- `businesses.layout_template` (new column, migration `012_layout_template.sql`) —
  which full template is active. Defaults to `'classic'`.
- `businesses.layout_template_selected_at` — NULL until the owner has explicitly
  picked one (via Settings or the first-login popup). Drives whether the popup shows.
- `GET /settings/layout-templates` — public, lists available templates (id/label/
  description/previewImage).
- `GET /settings/template/public` — public, resolves by host (like `/settings/theme/public`),
  returns `{ layoutTemplate }` for the live storefront to render.
- `PATCH /settings/layout-template` — staff-only, switches the active template.
- Kept entirely separate from `theme.presets.js` / `PATCH /settings/theme` (the color
  system) — no shared ids, no shared column, to avoid the earlier "editorial" name
  collision between a color preset and a layout template.

## Frontend
- `src/templates/registry.js` — maps a template id to its full `{ layout, pages }`
  component set. `App.jsx`'s storefront routes now render whichever set is active,
  instead of being hardcoded to Classic.
- `src/templates/useActiveTemplate.js` — reads the active template id from
  `TenantProvider` (which fetches/caches it via `/settings/template/public`,
  mirroring how the color theme is fetched/cached).
- `src/components/TenantProvider.jsx` — now also fetches + caches (localStorage,
  per-hostname) the active layout template, and exposes `refreshTenant()` so admin
  actions can force a re-fetch without a full page reload.
- `src/components/admin/AdminSettings.jsx` — `LayoutTemplateSection` replaces the
  old color-preset picker; switches `layout_template` via the new endpoint.
- `src/components/admin/TemplateChoicePopup.jsx` — shown once in the admin panel
  (Owner only) when `layoutTemplateSelectedAt` is null; picking a template calls the
  same update endpoint as Settings.

## Editorial template — what's real vs. fallback

Built by Codex, verified and wired in this pass:
- `src/templates/editorial/layout/{Navbar,Footer,MainLayout}.jsx`
- `src/templates/editorial/sections/{EditorialHero,GalleryProducts,StoryCollage,TestimonialCarousel,NewsletterBanner}.jsx`
- `src/templates/editorial/placeholderImages.js`, `useFooterContent.js`, `editorial.css`
- All of the above pull from the same real data sources as Classic
  (`commerceApi.publicProducts`, `useCmsHero`, the footer CMS content) — confirmed,
  not static/dummy.

Newly built in this pass:
- `src/templates/editorial/pages/Home.jsx` — assembles the sections above into an
  actual page. This is the only page with a genuinely custom Editorial design.

**Not yet built** — `registry.js` currently points Editorial's Shops/Collection/About/
Contact/Blog/ProductDetails at the same components Classic uses, so the storefront
works end-to-end, but those pages render with Classic's visual design inside
Editorial's Navbar/Footer/typography shell (a visible seam) until bespoke Editorial
versions of each are built. `TestimonialCarousel` also uses a small hardcoded review
list rather than a live reviews data source, since no reviews API exists yet.

## Editorial completion update

The six previously listed fallback routes now use bespoke Editorial pages and are
registered in `src/templates/registry.js`: Shops, Collection, About, Contact, Blog,
and ProductDetails. They retain Classic's public catalog, CMS hero, and cart data
contracts. The blog retains Classic's local post-content contract. `TestimonialCarousel`
remains hardcoded because there is no reviews API in the current API surface.

## Known gap
`TemplateChoicePopup`'s "Decide later" doesn't record a choice — the popup will
show again next login, by design (see the comment in that file), since there's no
separate "dismissed" state, only "chosen." If that should instead be dismiss-once,
say so and it's a one-column addition.
