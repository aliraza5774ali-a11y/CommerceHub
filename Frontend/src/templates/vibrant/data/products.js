// Standalone dummy catalog for the Vibrant template — independent of the
// shared storefront API, same pattern as Editorial/Luxe.

const IMG = {
  denim: "https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?auto=format&fit=crop&w=900&q=80",
  chinos: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
  dress: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
  hoodie: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
  scarf: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=900&q=80",
  blazer: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80",
  sneaker: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80",
  jacket: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80",
};

export const VIBRANT_PRODUCTS = [
  { id: "v1", slug: "classic-denim-jacket", title: "Classic Denim Jacket", name: "Classic Denim Jacket", description: "A washed denim jacket with a relaxed fit — a wardrobe staple for every season.", category: "Outerwear", price: "$75.00", discount: "", rating: 4.6, reviews: 236, img1: IMG.denim, images: [IMG.denim], material: "100% cotton denim", care: "Machine wash cold" },
  { id: "v2", slug: "slim-fit-chinos", title: "Slim Fit Chinos", name: "Slim Fit Chinos", description: "Tapered chinos with a touch of stretch, built for all-day comfort.", category: "Activewear", price: "$50.00", discount: "$65.00", rating: 4.4, reviews: 838, img1: IMG.chinos, images: [IMG.chinos], material: "Cotton stretch blend", care: "Machine wash cold" },
  { id: "v3", slug: "floral-summer-dress", title: "Floral Summer Dress", name: "Floral Summer Dress", description: "A breezy floral dress cut for warm-weather days, from brunch to boardwalk.", category: "New Arrivals", price: "$65.00", discount: "", rating: 4.5, reviews: 358, img1: IMG.dress, images: [IMG.dress], material: "Viscose blend", care: "Hand wash cold" },
  { id: "v4", slug: "essential-crewneck-sweater", title: "Essential Crewneck Sweater", name: "Essential Crewneck Sweater", description: "A heavyweight crewneck built for layering, soft on the inside, sharp on the outside.", category: "Cleared Sale", price: "$45.00", discount: "$60.00", rating: 4.7, reviews: 887, img1: IMG.hoodie, images: [IMG.hoodie], material: "Cotton fleece", care: "Machine wash cold" },
  { id: "v5", slug: "cashmere-blend-scarf", title: "The Cashmere Blend Scarf", name: "The Cashmere Blend Scarf", description: "A featherlight cashmere-blend scarf that adds warmth without the bulk.", category: "Accessories", price: "$55.00", discount: "", rating: 4.8, reviews: 142, img1: IMG.scarf, images: [IMG.scarf], material: "Cashmere blend", care: "Dry clean only" },
  { id: "v6", slug: "tailored-office-blazer", title: "Tailored Office Blazer", name: "Tailored Office Blazer", description: "A sophisticated, versatile blazer that redefines office wear.", category: "Outerwear", price: "$135.00", discount: "", rating: 4.5, reviews: 210, img1: IMG.blazer, images: [IMG.blazer], material: "Wool blend", care: "Dry clean only" },
  { id: "v7", slug: "high-performance-sneaker", title: "High-Performance Sneaker", name: "High-Performance Sneaker", description: "Built for movement — lightweight cushioning for every kind of day.", category: "Activewear", price: "$92.00", discount: "", rating: 4.6, reviews: 501, img1: IMG.sneaker, images: [IMG.sneaker], material: "Mesh, rubber sole", care: "Wipe clean" },
  { id: "v8", slug: "utility-field-jacket", title: "Utility Field Jacket", name: "Utility Field Jacket", description: "A rugged field jacket with plenty of pockets, built for effortless layering.", category: "New Arrivals", price: "$110.00", discount: "", rating: 4.3, reviews: 178, img1: IMG.jacket, images: [IMG.jacket], material: "Cotton canvas", care: "Machine wash cold" },
];

export function getVibrantProducts() {
  return VIBRANT_PRODUCTS;
}

export function getVibrantProduct(slug) {
  return VIBRANT_PRODUCTS.find((p) => p.slug === slug) || null;
}

export const VIBRANT_CATEGORIES = [
  { name: "New Arrivals", tagline: "Shop the latest styles", image: IMG.dress, size: "large" },
  { name: "Outerwear", tagline: "Jackets, coats & more", image: IMG.jacket, size: "wide" },
  { name: "Activewear", tagline: "For your workout & lifestyle", image: IMG.sneaker, size: "small" },
  { name: "Cleared Sale", tagline: "Up to 50% off", image: IMG.hoodie, size: "small" },
];
