// Standalone dummy hero copy for every Luxe page — no CMS fetch.

const HERO = {
  home: {
    badgeText: "Best collection",
    heading: "Quiet luxury, loudly considered.",
    subtext: "Explore premium clothing and statement accessories curated for every season, every style, and every occasion.",
    primaryLabel: "Shop the edit",
    primaryLink: "/shops",
    secondaryLabel: "View lookbook",
    secondaryLink: "/collections",
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=1400&q=80",
  },
  shops: {
    badgeText: "The shop",
    heading: "Every piece, considered.",
    subtext: "Clothing, bags, shoes, and accessories — built to last beyond a single season.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1400&q=80",
  },
  collections: {
    badgeText: "Collections",
    heading: "The lookbook.",
    subtext: "Grouped edits from the current season, styled the way we'd wear them.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=80",
  },
  about: {
    badgeText: "Our story",
    heading: "Considered, not chased.",
    subtext: "We design in small runs, choose fabric before form, and build pieces meant to outlast the season they were made for.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80",
  },
  blog: {
    badgeText: "Journal",
    heading: "Notes on quiet style.",
    subtext: "Fabric, fit, and the small decisions behind a considered wardrobe.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80",
  },
  contact: {
    badgeText: "Get in touch",
    heading: "We're here to help.",
    subtext: "Sizing questions, order support, or press requests — reach out any time.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80",
  },
};

export function getLuxeHero(slug) {
  return HERO[slug] || HERO.home;
}
