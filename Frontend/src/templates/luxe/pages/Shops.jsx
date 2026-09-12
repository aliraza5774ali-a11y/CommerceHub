import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getLuxeProducts } from "../data/products";
import { getLuxeHero } from "../data/heroContent";
import PageHero from "../components/PageHero";
import ProductCard from "../components/ProductCard";

export default function LuxeShops() {
  const hero = getLuxeHero("shops");
  const products = getLuxeProducts();
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
        <div className="mb-10 flex flex-col justify-between gap-5 border-b border-[var(--line)] pb-4 md:flex-row">
          <div className="luxe-scrollbar flex gap-5 overflow-x-auto">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={`shrink-0 text-sm ${category === c ? "text-[var(--ink)] underline underline-offset-4" : "text-[var(--ink-soft)]"}`}>
                {c}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 border-b border-[var(--line)] pb-1 text-sm">
            <Search size={15} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="w-48 bg-transparent outline-none placeholder:text-[var(--ink-soft)]" />
          </label>
        </div>
        {visible.length ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        ) : (
          <p className="py-16 text-center luxe-display text-3xl">No pieces found.</p>
        )}
      </section>
    </>
  );
}
