const HERO = {
  home: {
    badgeText: "Check, reimagined — 2026",
    headingPre: "Checks that speak",
    headingEm: "before",
    headingPost: "you do.",
    subtext: "Everyday check shirts, cut with intent. Premium cotton, modern patterns and colours with a point of view.",
    primaryLabel: "Shop Collection",
    primaryLink: "/shops",
    secondaryLabel: "Explore styles",
    secondaryLink: "/collections",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=80",
  },
  shops: {
    badgeText: "The shop",
    heading: "Every check, one place.",
    subtext: "Sage, copper, cloud, moss, rose, navy — pick the pattern that speaks for you.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1400&q=80",
  },
  collections: {
    badgeText: "Collections",
    heading: "Style it your way.",
    subtext: "One check, three moods — weekend, office, and casual hangout.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=80",
  },
  about: {
    badgeText: "Our story",
    heading: "Built for the everyday flex.",
    subtext: "Good shirts get better with every wear. We make the ones you reach for first, then keep on rotation.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80",
  },
  blog: {
    badgeText: "Journal",
    heading: "Notes from the studio.",
    subtext: "Fabric, fit, and the small decisions behind every check.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80",
  },
  contact: {
    badgeText: "Get in touch",
    heading: "We're here to help.",
    subtext: "Sizing questions, order support, or press requests — reach out any time.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80",
  },
};

export function getTexartHero(slug) {
  return HERO[slug] || HERO.home;
}
