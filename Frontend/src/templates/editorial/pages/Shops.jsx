import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getDummyProducts } from "../data/products";
import { getDummyHero } from "../data/heroContent";
import PageHero from "../components/PageHero";
import ProductCard from "../components/ProductCard";

export default function EditorialShops() {
  const hero = getDummyHero("shops");
  const products = getDummyProducts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All products");
  const categories = useMemo(() => ["All products", ...new Set(products.map((p) => p.category).filter(Boolean))], [products]);
  const visible = useMemo(
    () => products.filter((p) => (category === "All products" || p.category === category) && p.title.toLowerCase().includes(query.toLowerCase())),
    [products, category, query]
  );

  return (
    <>
      <PageHero content={hero} eyebrow="The shop" />
      <section className="px-5 py-12 sm:px-10 lg:px-16">
        <div className="mb-10 flex flex-col justify-between gap-5 border-y border-[var(--forest)]/20 py-4 md:flex-row">
          <div className="editorial-scrollbar flex gap-5 overflow-x-auto">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={`shrink-0 text-xs uppercase tracking-[.15em] ${category === c ? "text-[var(--coral)]" : "text-[var(--forest)]/60"}`}>
                {c}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 border-b border-[var(--forest)]/30 pb-1 text-sm">
            <Search size={15} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the collection" className="w-52 bg-transparent outline-none placeholder:text-[var(--forest)]/45" />
          </label>
        </div>
        {visible.length ? (
          <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center editorial-display text-3xl">No pieces found.</p>
        )}
        <p className="mt-8 text-xs uppercase tracking-[.15em] text-[var(--forest)]/55">{visible.length} of {products.length} pieces</p>
      </section>
    </>
  );
}
