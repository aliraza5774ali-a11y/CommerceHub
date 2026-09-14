import { Link } from "react-router-dom";
import { getVibrantProducts } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function CollectionGrid() {
  const products = getVibrantProducts().slice(0, 4);
  return (
    <section className="px-5 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl items-end justify-between">
        <p className="vibrant-display text-2xl">Our Collection</p>
        <Link to="/shops" className="text-sm text-[var(--sun)]">Browse All Products →</Link>
      </div>
      <div className="mx-auto mt-6 grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.slug} product={p} badge={i === 1 ? "-20%" : null} />
        ))}
      </div>
    </section>
  );
}
