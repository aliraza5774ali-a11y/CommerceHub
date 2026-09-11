// Every storefront page that gets a CMS-editable hero banner in the admin
// panel. Home has its own richer editor (see homepageSections.js) because it
// has multiple section types — the rest only expose the hero banner, since
// that's the only content on these pages that isn't pulled live from the
// catalog/blog data.

export const SITE_PAGES = [
  {
    slug: "home",
    label: "Home",
    adminPath: "/admin/homepage",
    heroMode: "hero",
    defaults: {
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
    },
  },
  {
    slug: "shops",
    label: "Shop",
    adminPath: "/admin/pages/shops",
    heroMode: "shop",
    defaults: {
      badgeLabel: "Shop",
      badgeText: "Curated for you",
      heading: "Find your perfect fit",
      subtext: "Browse our latest arrivals and timeless classics",
      primaryLabel: "New Arrivals",
      primaryLink: "/shops",
      secondaryLabel: "Best Sellers",
      secondaryLink: "/shops",
      image: "",
    },
  },
  {
    slug: "collections",
    label: "Collections",
    adminPath: "/admin/pages/collections",
    heroMode: "collection",
    defaults: {
      badgeLabel: "",
      badgeText: "",
      heading: "The Essentials",
      subtext: "Minimal pieces for maximum impact",
      primaryLabel: "View All",
      primaryLink: "/shops",
      secondaryLabel: "",
      secondaryLink: "",
      image: "",
    },
  },
  {
    slug: "about",
    label: "About",
    adminPath: "/admin/pages/about",
    heroMode: "about",
    defaults: {
      badgeLabel: "About Us",
      badgeText: "Crafting Experiences",
      heading: "Designing Products",
      subtext:
        "We believe great products are built through thoughtful design, quality craftsmanship, and attention to every detail.",
      primaryLabel: "",
      primaryLink: "",
      secondaryLabel: "",
      secondaryLink: "",
      image: "",
    },
  },
  {
    slug: "contact",
    label: "Contact",
    adminPath: "/admin/pages/contact",
    heroMode: "contact",
    defaults: {
      badgeLabel: "Hello",
      badgeText: "We'd love to hear from you",
      heading: "Let's start a conversation",
      subtext:
        "Have a question, collaboration idea, or just want to say hi? Our team is here to help.",
      primaryLabel: "Send a Message",
      primaryLink: "",
      secondaryLabel: "Visit Our Store",
      secondaryLink: "",
      image: "",
    },
  },
  {
    slug: "blog",
    label: "Blog",
    adminPath: "/admin/pages/blog",
    heroMode: "blog",
    defaults: {
      badgeLabel: "Shop",
      badgeText: "Curated for you",
      heading: "Find your perfect fit",
      subtext: "Browse our latest arrivals and timeless classics",
      primaryLabel: "New Arrivals",
      primaryLink: "",
      secondaryLabel: "Best Sellers",
      secondaryLink: "",
      image: "",
    },
  },
];

export const getPageDef = (slug) => SITE_PAGES.find((p) => p.slug === slug);

// Global (not page-specific) storefront content — lives on its own CMS page
// so it can be fetched once and reused by every page's layout.
export const SITE_GLOBAL_SLUG = "site";

export const DEFAULT_FOOTER_CONTENT = {
  brandName: "VELOUR",
  tagline: "Minimal luxury for those who dress with intention. Curated drops, timeless pieces.",
  copyrightText: "© 2026 VELOUR. All rights reserved.",
  newsletterEnabled: true,
  social: {
    instagram: "",
    twitter: "",
    facebook: "",
    youtube: "",
  },
};
