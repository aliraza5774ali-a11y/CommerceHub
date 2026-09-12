import { Link } from "react-router-dom";
import { getDummyProducts } from "../data/products";
import { getDummyHero } from "../data/heroContent";
import PageHero from "../components/PageHero";
import ProductCard from "../components/ProductCard";

export default function EditorialCollection() {
  const hero = getDummyHero("collections");
  const products = getDummyProducts();
  const groups = [...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <>
      <PageHero content={hero} eyebrow="Collections" />
      <section className="px-5 py-16 sm:px-10 lg:px-16">
        {groups.length ? (
          groups.map((group) => (
            <div key={group} className="mb-16">
              <div className="mb-6 flex items-end justify-between border-b border-[var(--forest)]/20 pb-3">
                <h2 className="editorial-display text-4xl">{group}</h2>
                <Link to="/shops" className="text-xs uppercase tracking-[.15em] text-[var(--coral)]">View all</Link>
              </div>
              <div className="editorial-scrollbar flex gap-5 overflow-x-auto pb-4">
                {products.filter((p) => p.category === group).slice(0, 4).map((p) => (
                  <div key={p.slug} className="w-64 shrink-0">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="editorial-display text-3xl">Collections are arriving soon.</p>
        )}
      </section>
    </>
  );
}
