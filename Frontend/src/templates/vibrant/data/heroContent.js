const HERO = {
  home: {
    badgeText: "New season",
    heading: "Elevate your self.",
    subtext: "Assurance in every layer, with trusted comfort. Our quality ensures satisfaction and peace.",
    primaryLabel: "Shop Now",
    primaryLink: "/shops",
    rating: 4.8,
    reviewCount: "11K",
    image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=1000&q=80",
  },
  shops: {
    badgeText: "The shop",
    heading: "Every style, one place.",
    subtext: "Outerwear, activewear, dresses and more — dressed for however your day unfolds.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1400&q=80",
  },
  collections: {
    badgeText: "Collections",
    heading: "Curated edits.",
    subtext: "Grouped by mood and moment — mix, match, and make it yours.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=80",
  },
  about: {
    badgeText: "Our story",
    heading: "Bold style, made accessible.",
    subtext: "We believe great style shouldn't be complicated — just well made, well priced, and made to be worn.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80",
  },
  blog: {
    badgeText: "Reviews & Reads",
    heading: "Stories from the studio.",
    subtext: "Styling tips, drop announcements, and the occasional behind-the-scenes.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80",
  },
  contact: {
    badgeText: "Contact",
    heading: "Let's talk.",
    subtext: "Order questions, sizing help, or partnership requests — we're a message away.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80",
  },
};

export function getVibrantHero(slug) {
  return HERO[slug] || HERO.home;
}
