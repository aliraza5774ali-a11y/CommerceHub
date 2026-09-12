import { Link } from "react-router-dom";
import { getLuxeProducts } from "../data/products";
import ProductCard from "../components/ProductCard";

// Bento-style grid of new arrivals, echoing the reference's
// "This week's edit" section — a mix of large and small tiles.
export default function ThisWeeksEdit() {
  const products = getLuxeProducts().slice(0, 6);
  const [first, ...rest] = products;

  return (
    <section className="px-5 py-16 sm:px-10 lg:px-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[.2em] text-[var(--ink-soft)]">New arrivals</p>
          <h2 className="luxe-display mt-2 text-3xl sm:text-4xl">This week's edit</h2>
        </div>
        <Link to="/shops" className="text-sm underline underline-offset-4">View all</Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {first && (
          <div className="sm:col-span-1 sm:row-span-2">
            <ProductCard product={first} tag="New" />
          </div>
        )}
        {rest.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
