import { Link } from "react-router-dom";
import { getDummyProducts } from "../data/products";

// Featured-product split panel, similar to the reference's "New Arrival"
// tile — uses the last item in the local dummy catalog.
export default function NewArrivalFeature() {
  const products = getDummyProducts();
  const product = products[products.length - 1];

  if (!product) return null;

  return (
    <section className="px-5 pb-16 sm:px-10 lg:px-16">
      <div className="grid overflow-hidden rounded-2xl bg-[var(--paper-dim)] sm:grid-cols-2">
        <div className="aspect-[4/3] sm:aspect-auto">
          <img src={product.img1} alt={product.title} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <p className="editorial-badge w-fit bg-[var(--forest)] text-[var(--paper)]">
            New arrival
          </p>
          <h2 className="editorial-display mt-4 text-3xl leading-tight sm:text-4xl">
            {product.title}
          </h2>
          <p className="mt-3 max-w-sm leading-7 text-[var(--forest)]/70">
            {product.description}
          </p>
          <Link to={`/shop/${product.slug}`} className="editorial-pill editorial-pill-gold mt-7 w-fit">
            Shop now
          </Link>
        </div>
      </div>
    </section>
  );
}
