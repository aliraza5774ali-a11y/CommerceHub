import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getTexartProducts } from "../data/products";
import { getTexartHero } from "../data/heroContent";
import PageHero from "../components/PageHero";
import ProductCard from "../components/ProductCard";

export default function TexartShops() {
  const hero = getTexartHero("shops");
  const products = getTexartProducts();
  const [query, setQuery] = useState("");
  const visible = useMemo(() => products.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())), [products, query]);

  return (
    <>
      <PageHero content={hero} />
      <section className="px-5 py-14 sm:px-10 lg:px-16">
        <label className="mx-auto flex max-w-sm items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-sm">
          <Search size={15} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search shirts" className="w-full bg-transparent outline-none" />
        </label>
        {visible.length ? (
          <div className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-5 sm:grid-cols-3">
            {visible.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        ) : (
          <p className="py-16 text-center texart-display text-3xl">No shirts found.</p>
        )}
      </section>
    </>
  );
}
