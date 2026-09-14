import { Link } from "react-router-dom";
import { getVibrantProducts } from "../data/products";
import { getVibrantHero } from "../data/heroContent";
import PageHero from "../components/PageHero";
import ProductCard from "../components/ProductCard";

export default function VibrantCollection() {
  const hero = getVibrantHero("collections");
  const products = getVibrantProducts();
  const groups = [...new Set(products.map((p) => p.category))];

  return (
    <>
      <PageHero content={hero} />
      <section className="px-5 py-14 sm:px-10 lg:px-16">
        {groups.map((group) => (
          <div key={group} className="mb-14">
            <div className="mb-5 flex items-end justify-between">
              <p className="vibrant-display text-2xl">{group}</p>
              <Link to="/shops" className="text-sm text-[var(--sun)]">View all</Link>
            </div>
            <div className="vibrant-scrollbar flex gap-4 overflow-x-auto pb-4">
              {products.filter((p) => p.category === group).slice(0, 4).map((p) => (
                <div key={p.slug} className="w-52 shrink-0"><ProductCard product={p} /></div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
