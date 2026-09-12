// Standalone dummy hero copy for every Editorial page — no CMS fetch.
// Swap these strings/images directly to restyle content for this template
// without touching the shared storefront CMS.

const HERO = {
  home: {
    badgeText: "A considered collection",
    heading: "Eco-Friendly Kitchenware for a greener home.",
    subtext: "Thoughtfully made pieces with a sense of everyday ritual — natural materials, sustainable sourcing, built to be used for years.",
    primaryLabel: "Shop now",
    primaryLink: "/shops",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=80",
  },
  shops: {
    badgeText: "The shop",
    heading: "The full collection.",
    subtext: "Every piece we make, in one place — built to last, sourced responsibly.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1400&q=80",
  },
  collections: {
    badgeText: "Collections",
    heading: "Curated for every corner of the kitchen.",
    subtext: "Grouped by ritual, not just category — drinkware, prep, storage, and more.",
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1400&q=80",
  },
  about: {
    badgeText: "Our story",
    heading: "Thoughtful objects for a life well lived.",
    subtext: "We started with a simple idea: kitchenware should be both beautiful and kind to the planet. Every material is chosen first, every form follows.",
    image: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?auto=format&fit=crop&w=1400&q=80",
  },
  blog: {
    badgeText: "Field notes",
    heading: "Ideas for a greener kitchen.",
    subtext: "Stories on materials, sourcing, and the small rituals that make a house feel like home.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80",
  },
  contact: {
    badgeText: "Correspondence",
    heading: "A good conversation starts here.",
    subtext: "Questions about an order, a material, or a bulk request — we read every message.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80",
  },
};

export function getDummyHero(slug) {
  return HERO[slug] || HERO.home;
}
