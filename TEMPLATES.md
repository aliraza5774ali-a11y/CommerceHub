# Storefront Templates

## Registry

- `Frontend/src/templates/registry.js` mirrors Classic page and layout components with the `classic` and `editorial` entries.
- `Frontend/src/templates/useActiveTemplate.js` reads `templateId` from the existing `api.settings()` response and falls back to `classic`.

## Editorial files

- `Frontend/src/templates/editorial/pages/Home.jsx` mirrors Classic `pages/Home.jsx`; it consumes `homepageSections` and `storefrontPage("home")` while mapping products, testimonials, and collection sections to Editorial presentations.
- `Frontend/src/templates/editorial/pages/{About,Shops,Collection,Contact,Blog}.jsx` mirror the same Classic routes and use the existing `useCmsHero` page content contract plus the existing catalog/CMS content.
- `Frontend/src/templates/editorial/pages/ProductDetails.jsx` mirrors Classic `pages/ProductDetails.jsx` and delegates to its existing live product/cart flow.
- `Frontend/src/templates/editorial/sections/GalleryProducts.jsx` mirrors `components/sections/ProductSection.jsx` and calls `api.publicProducts()`.
- `Frontend/src/templates/editorial/sections/TestimonialCarousel.jsx` mirrors `components/sections/ReviewSection.jsx`; the current Classic review content is local static content, so the Editorial quote cards use that same available content contract until a reviews endpoint exists.
- `Frontend/src/templates/editorial/sections/StoryCollage.jsx` mirrors `AboutSection`/`CollectionStory` and consumes the existing About CMS hero/story content.
- `Frontend/src/templates/editorial/sections/NewsletterBanner.jsx` mirrors the Classic footer newsletter and consumes the same global footer CMS section and `newsletterEnabled` field.
- `Frontend/src/templates/editorial/layout/{Navbar,Footer,MainLayout}.jsx` provide the Editorial layout, with Footer reading the same global footer CMS section.

## Placeholder image slots

All swap-in image URLs live in `Frontend/src/templates/editorial/placeholderImages.js`:

- `galleryFallback` is used only when a catalog product has no image.
- `storyCollageB` and `storyCollageC` are pending CMS story photography; `storyCollageA` is replaced by the About CMS image when available.
- `newsletterTileA`, `newsletterTileB`, `newsletterTileC`, and `newsletterTileD` are pending campaign photography.
- `pageFallback` is used when a CMS page has no hero image.

Product images and CMS hero images always take precedence over placeholders.
