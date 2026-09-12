import { Link } from "react-router-dom";
import { getLuxeProducts } from "../data/products";

// Full-width promo banner featuring one product, matching the reference's
// "Carry Confidence With Every Single Outfit Today" bag panel.
export default function PromoBanner() {
  const product = getLuxeProducts().find((p) => p.category === "Bags") || getLuxeProducts()[0];

  return (
    <section className="relative isolate overflow-hidden bg-[var(--sand)] px-5 py-16 sm:px-10 lg:px-16">
      <img src={product.img1} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35" />
      <div className="mx-auto max-w-xl text-center">
        <p className="text-xs uppercase tracking-[.2em] text-[var(--ink-soft)]">{product.category}</p>
        <h2 className="luxe-display mt-4 text-3xl leading-tight sm:text-4xl">
          Carry confidence with every single outfit today.
        </h2>
        <Link to={`/shop/${product.slug}`} className="luxe-btn luxe-btn-solid mt-7">
          Shop the piece
        </Link>
      </div>
    </section>
  );
}
