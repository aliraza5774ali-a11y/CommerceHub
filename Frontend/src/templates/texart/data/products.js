// Standalone dummy catalog for the Texart template — independent of the
// shared storefront API, same pattern as Editorial/Luxe/Vibrant.

const IMG = {
  sage: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
  copper: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80",
  cloud: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80",
  moss: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80",
  rose: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?auto=format&fit=crop&w=900&q=80",
  navy: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=900&q=80",
};

export const TEXART_PRODUCTS = [
  { id: "t1", slug: "sage-check", title: "Sage Check", name: "Sage Check", description: "A soft sage-toned check shirt in breathable combed cotton, cut for everyday wear.", category: "Check Shirts", price: "$2,490", isNew: true, rating: 5, swatches: ["#b7c9a8", "#d9d2c2", "#8b8f86"], img1: IMG.sage, images: [IMG.sage], material: "Combed cotton, 150 GSM", care: "Machine wash cold" },
  { id: "t2", slug: "copper-check", title: "Copper Check", name: "Copper Check", description: "A bold copper-and-navy check with a relaxed camp collar — the one that gets noticed.", category: "Check Shirts", price: "$2,490", isNew: true, rating: 5, swatches: ["#b5551f", "#2b3a52", "#f2e6c9"], img1: IMG.copper, images: [IMG.copper], material: "Combed cotton, 150 GSM", care: "Machine wash cold" },
  { id: "t3", slug: "cloud-check", title: "Cloud Check", name: "Cloud Check", description: "A pale blue windowpane check, light enough for warm days, sharp enough for the office.", category: "Check Shirts", price: "$2,490", isNew: false, rating: 5, swatches: ["#c7d8ea", "#eef1f3", "#8fa6bd"], img1: IMG.cloud, images: [IMG.cloud], material: "Combed cotton, 150 GSM", care: "Machine wash cold" },
  { id: "t4", slug: "moss-check", title: "Moss Check", name: "Moss Check", description: "An earthy moss-green check layered over a soft cream base — built for repeat wear.", category: "Check Shirts", price: "$2,490", isNew: true, rating: 5, swatches: ["#7c8a63", "#d7d0bd", "#3f4636"], img1: IMG.moss, images: [IMG.moss], material: "Combed cotton, 150 GSM", care: "Machine wash cold" },
  { id: "t5", slug: "rose-check", title: "Rose Check", name: "Rose Check", description: "A muted rose-and-navy plaid that softens any outfit without trying too hard.", category: "Check Shirts", price: "$2,490", isNew: false, rating: 5, swatches: ["#c98a8a", "#2c3550", "#eee0d8"], img1: IMG.rose, images: [IMG.rose], material: "Combed cotton, 150 GSM", care: "Machine wash cold" },
  { id: "t6", slug: "navy-check", title: "Navy Check", name: "Navy Check", description: "A classic navy check done right — timeless pattern, modern relaxed fit.", category: "Check Shirts", price: "$2,490", isNew: false, rating: 5, swatches: ["#c98a8a", "#e8dcd0", "#f0eee6"], img1: IMG.navy, images: [IMG.navy], material: "Combed cotton, 150 GSM", care: "Machine wash cold" },
];

export function getTexartProducts() {
  return TEXART_PRODUCTS;
}

export function getTexartProduct(slug) {
  return TEXART_PRODUCTS.find((p) => p.slug === slug) || null;
}
