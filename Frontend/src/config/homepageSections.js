// Single source of truth for how CMS section types map onto the homepage.
// Backend already supports these sectionType values (see cms.service.js
// sectionTypes set): hero, products, best_sellers, collection,
// testimonials, style_and_wear, blog, banner, footer, navbar, rich_text, image.
// The homepage only ever needs a subset of those.

export const HOMEPAGE_SLUG = "home";

export const HOMEPAGE_SECTION_TYPES = [
  "hero",
  "products",
  "best_sellers",
  "collection",
  "testimonials",
  "style_and_wear",
  "blog",
];

export const SECTION_LABELS = {
  hero: "Hero Banner",
  products: "New Arrivals",
  best_sellers: "Best Sellers",
  collection: "Collections",
  testimonials: "Testimonials",
  style_and_wear: "Style & Wear",
  blog: "Blog / News",
};

export const SECTION_DESCRIPTIONS = {
  hero: "Full-width banner at the top of the homepage — image, heading, subtext and buttons.",
  products: "Grid of newly published products.",
  best_sellers: "Grid of your top-performing products.",
  collection: "Editorial category picks (men's, women's, children's).",
  testimonials: "Customer reviews carousel.",
  style_and_wear: "Style inspiration cards.",
  blog: "Latest blog posts preview.",
};

// Only sections whose visuals are actually driven by editable text/images —
// the rest are enable/disable + reorder only, since their layouts are fixed.
export const EDITABLE_SECTION_TYPES = new Set(["hero"]);

export const DEFAULT_HERO_CONTENT = {
  badgeLabel: "New",
  badgeText: "Summer Collection 2026",
  heading: "Crafted for those who refuse ordinary",
  subtext:
    "Discover pieces designed with intention, built to last, and made for the moments that matter most.",
  primaryLabel: "Explore Collection",
  primaryLink: "/shops",
  secondaryLabel: "Our Story",
  secondaryLink: "/about",
  image: "",
};

// Seed section list used the first time an admin sets up the homepage CMS page.
export const DEFAULT_HOMEPAGE_SECTIONS = HOMEPAGE_SECTION_TYPES.map((sectionType, index) => ({
  sectionType,
  position: index,
  enabled: true,
  content: sectionType === "hero" ? DEFAULT_HERO_CONTENT : {},
}));
