import { Link } from "react-router-dom";
import { getLuxeProducts } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function BestSellers() {
  const products = getLuxeProducts().slice(2, 10);

  return (
    <section className="px-5 py-16 sm:px-10 lg:px-16">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="luxe-display text-3xl sm:text-4xl">Best sellers</h2>
        <Link to="/shops" className="text-sm underline underline-offset-4">View all</Link>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
