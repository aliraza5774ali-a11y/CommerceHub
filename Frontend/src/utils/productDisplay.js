// Converts a product record returned by the storefront API
// (GET /catalog/public/products, GET /catalog/public/products/:slug)
// into the flat shape the storefront UI components expect.

// Neutral placeholder used only when a real product has no uploaded image yet —
// never fake/sample product data, just an empty-image state.
export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='750' viewBox='0 0 600 750'%3E%3Crect width='600' height='750' fill='%23ededed'/%3E%3Ctext x='300' y='385' font-family='sans-serif' font-size='22' fill='%23b3b3b3' text-anchor='middle'%3ENo image%3C/text%3E%3C/svg%3E";

export function toDisplayProduct(item) {
  if (!item) return null;

  const imageUrls = (item.images || [])
    .slice()
    .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
    .map((img) => img.imageUrl)
    .filter(Boolean);

  const regularPrice = Number(item.price).toFixed(2);
  const hasSale =
    item.salePrice !== null &&
    item.salePrice !== undefined &&
    Number(item.salePrice) < Number(item.price);
  const salePrice = hasSale ? Number(item.salePrice).toFixed(2) : null;

  return {
    id: item.id,
    slug: item.slug,
    title: item.name,
    name: item.name,
    description: item.description || "",
    category: item.categoryName || "",
    price: `$${salePrice || regularPrice}`,
    discount: hasSale ? `$${regularPrice}` : "",
    img1: imageUrls[0] || PLACEHOLDER_IMAGE,
    img2: imageUrls[1] || imageUrls[0] || PLACEHOLDER_IMAGE,
    images: imageUrls.length ? imageUrls : [PLACEHOLDER_IMAGE],
  };
}

export function toDisplayProducts(items) {
  return (items || []).map(toDisplayProduct);
}
