import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getVibrantProducts } from "../data/products";
import { getVibrantHero } from "../data/heroContent";
import PageHero from "../components/PageHero";
import ProductCard from "../components/ProductCard";

export default function VibrantShops() {
  const hero = getVibrantHero("shops");
  const products = getVibrantProducts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = useMemo(() => ["All", ...new Set(products.map((p) => p.category))], [products]);
  const visible = useMemo(
    () => products.filter((p) => (category === "All" || p.category === category) && p.title.toLowerCase().includes(query.toLowerCase())),
    [products, category, query]
  );

  return (
    <>
      <PageHero content={hero} />
      <section className="px-5 py-12 sm:px-10 lg:px-16">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-2 text-sm ${category === c ? "bg-[var(--sun)] text-white" : "bg-white text-[var(--ink-soft)]"}`}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            <Search size={15} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="w-40 bg-transparent outline-none" />
          </label>
        </div>
        {visible.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        ) : (
          <p className="py-16 text-center vibrant-display text-2xl">No products found.</p>
        )}
      </section>
    </>
  );
}
