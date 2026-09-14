import { Link } from "react-router-dom";
import { getTexartProducts } from "../data/products";
import { getTexartHero } from "../data/heroContent";
import PageHero from "../components/PageHero";
import ProductCard from "../components/ProductCard";

export default function TexartCollection() {
  const hero = getTexartHero("collections");
  const products = getTexartProducts();

  return (
    <>
      <PageHero content={hero} />
      <section className="px-5 py-14 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-6xl items-end justify-between">
          <h2 className="texart-display text-3xl">Check Shirts</h2>
          <Link to="/shops" className="text-sm underline underline-offset-4">View all</Link>
        </div>
        <div className="mx-auto mt-6 grid max-w-6xl grid-cols-2 gap-5 sm:grid-cols-3">
          {products.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>
    </>
  );
}
