// Standalone dummy catalog for the Luxe template — fully independent of the
// shared storefront API, like Editorial's data/products.js.

const IMG = {
  dress: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80",
  watch: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80",
  tote: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=80",
  trouser: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
  loafer: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=900&q=80",
  blazer: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80",
  cashmere: "https://images.unsplash.com/photo-1614093302611-8efc4de12407?auto=format&fit=crop&w=900&q=80",
  cap: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80",
  boot: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=900&q=80",
  coat: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80",
};

export const LUXE_PRODUCTS = [
  { id: "l1", slug: "the-column-dress", title: "The Column Dress", name: "The Column Dress", description: "An organic cotton twill dress cut for movement — a single seamless line from shoulder to hem.", category: "Clothing", price: "$420.00", discount: "", img1: IMG.dress, img2: IMG.dress, images: [IMG.dress], material: "Organic cotton twill", care: "Dry clean only" },
  { id: "l2", slug: "hand-leather-watch", title: "Hand Leather Watch", name: "Hand Leather Watch", description: "A sunburst dial watch on a hand-stitched leather strap, finished in-house.", category: "Watches", price: "$548.00", discount: "", img1: IMG.watch, img2: IMG.watch, images: [IMG.watch], material: "Stainless steel, leather", care: "Wipe clean" },
  { id: "l3", slug: "structured-tote-bag", title: "Structured Tote Bag", name: "Structured Tote Bag", description: "A grain leather tote with a structured base, built to carry a day's essentials with ease.", category: "Bags", price: "$680.00", discount: "", img1: IMG.tote, img2: IMG.tote, images: [IMG.tote], material: "Grain leather", care: "Leather conditioner as needed" },
  { id: "l4", slug: "tailored-trouser", title: "Tailored Trouser", name: "Tailored Trouser", description: "Wide-leg wool trousers with a clean, tailored break — a wardrobe staple.", category: "Clothing", price: "$310.00", discount: "", img1: IMG.trouser, img2: IMG.trouser, images: [IMG.trouser], material: "Wool blend", care: "Dry clean only" },
  { id: "l5", slug: "leather-loafer", title: "Leather Loafer", name: "Leather Loafer", description: "A hand-sewn penny loafer in supple leather, built on a cushioned sole.", category: "Shoes", price: "$420.00", discount: "", img1: IMG.loafer, img2: IMG.loafer, images: [IMG.loafer], material: "Full-grain leather", care: "Polish as needed" },
  { id: "l6", slug: "structured-blazer", title: "Structured Blazer", name: "Structured Blazer", description: "A double-breasted blazer with a sharp shoulder and a soft, brushed finish.", category: "Clothing", price: "$540.00", discount: "", img1: IMG.blazer, img2: IMG.blazer, images: [IMG.blazer], material: "Wool blend", care: "Dry clean only" },
  { id: "l7", slug: "cashmere-crew", title: "Cashmere Crew", name: "Cashmere Crew", description: "A featherweight cashmere crewneck, soft against the skin and easy to layer.", category: "Clothing", price: "$310.00", discount: "", img1: IMG.cashmere, img2: IMG.cashmere, images: [IMG.cashmere], material: "100% cashmere", care: "Hand wash cold" },
  { id: "l8", slug: "beige-cap", title: "Beige Cap", name: "Beige Cap", description: "A cotton twill six-panel cap with an adjustable leather strap.", category: "Accessories", price: "$85.00", discount: "", img1: IMG.cap, img2: IMG.cap, images: [IMG.cap], material: "Cotton twill, leather", care: "Spot clean" },
  { id: "l9", slug: "ankle-boot", title: "Ankle Boot", name: "Ankle Boot", description: "A Chelsea-style ankle boot in polished leather with an elastic side panel.", category: "Shoes", price: "$460.00", discount: "", img1: IMG.boot, img2: IMG.boot, images: [IMG.boot], material: "Polished leather", care: "Polish as needed" },
  { id: "l10", slug: "wool-cocoon-coat", title: "Wool Cocoon Coat", name: "Wool Cocoon Coat", description: "An oversized cocoon coat in brushed wool, cut for effortless layering.", category: "Clothing", price: "$780.00", discount: "$860.00", img1: IMG.coat, img2: IMG.coat, images: [IMG.coat], material: "Brushed wool", care: "Dry clean only" },
];

export function getLuxeProducts() {
  return LUXE_PRODUCTS;
}

export function getLuxeProduct(slug) {
  return LUXE_PRODUCTS.find((p) => p.slug === slug) || null;
}

export const LUXE_CATEGORIES = [
  { name: "Men", count: "120+ items", image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=200&q=80" },
  { name: "Women", count: "160+ items", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
  { name: "Bags", count: "220+ items", image: IMG.tote },
  { name: "Shoes", count: "140+ items", image: IMG.loafer },
  { name: "Watches", count: "210+ items", image: IMG.watch },
  { name: "Accessories", count: "320+ items", image: IMG.cap },
];
