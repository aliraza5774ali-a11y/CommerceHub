import { Link } from "react-router-dom";
import { getTexartProducts } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Favourites() {
  const products = getTexartProducts();
  return (
    <section className="px-5 py-16 sm:px-10 lg:px-16">
      <p className="text-xs uppercase tracking-[.2em] text-[var(--ink-soft)]">The Edit / 01</p>
      <h2 className="texart-display mt-2 text-center text-4xl sm:text-5xl">
        Your new <em>favourites</em>.
      </h2>
      <div className="mx-auto mt-10 grid max-w-6xl gap-5 sm:grid-cols-3">
        {products.map((p, i) => (
          <ProductCard key={p.slug} product={p} highlight={i === 1} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link to="/shops" className="texart-btn texart-btn-solid">See all shirts →</Link>
      </div>
    </section>
  );
}
