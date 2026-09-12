import { Link } from "react-router-dom";
import { getLuxeProducts } from "../data/products";
import { getLuxeHero } from "../data/heroContent";
import PageHero from "../components/PageHero";
import ProductCard from "../components/ProductCard";

export default function LuxeCollection() {
  const hero = getLuxeHero("collections");
  const products = getLuxeProducts();
  const groups = [...new Set(products.map((p) => p.category))];

  return (
    <>
      <PageHero content={hero} />
      <section className="px-5 py-16 sm:px-10 lg:px-16">
        {groups.map((group) => (
          <div key={group} className="mb-16">
            <div className="mb-6 flex items-end justify-between border-b border-[var(--line)] pb-3">
              <h2 className="luxe-display text-3xl">{group}</h2>
              <Link to="/shops" className="text-sm underline underline-offset-4">View all</Link>
            </div>
            <div className="luxe-scrollbar flex gap-5 overflow-x-auto pb-4">
              {products.filter((p) => p.category === group).slice(0, 4).map((p) => (
                <div key={p.slug} className="w-56 shrink-0"><ProductCard product={p} /></div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
