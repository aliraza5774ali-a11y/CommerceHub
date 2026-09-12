import { useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getDummyProducts } from "../data/products";
import ProductCard from "../components/ProductCard";

const BADGES = ["Promotion", "New", "Customer favorite", null];

// Horizontal bestseller carousel with prev/next arrow controls, matching the
// reference layout's "Bestselling Products" row. Uses local dummy data.
export default function GalleryProducts() {
  const products = getDummyProducts();
  const trackRef = useRef(null);

  const scrollBy = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <section className="px-5 py-16 sm:px-10 lg:px-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[.2em] text-[var(--coral)]">
            Eco essentials · planet-friendly
          </p>
          <h2 className="editorial-display mt-2 text-3xl sm:text-4xl">
            Bestselling products
          </h2>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <button className="editorial-arrow-btn" onClick={() => scrollBy(-1)} aria-label="Previous">
            <ChevronLeft size={18} />
          </button>
          <button className="editorial-arrow-btn" onClick={() => scrollBy(1)} aria-label="Next">
            <ChevronRight size={18} />
          </button>
          <Link
            to="/shops"
            className="ml-2 flex items-center gap-1 text-xs uppercase tracking-[.15em] text-[var(--forest)]/70 hover:text-[var(--coral)]"
          >
            More products <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div ref={trackRef} className="editorial-scrollbar flex gap-5 overflow-x-auto pb-4 scroll-smooth">
        {products.slice(0, 8).map((p, i) => (
          <div className="w-60 shrink-0 sm:w-64" key={p.slug}>
            <ProductCard product={p} badge={BADGES[i % BADGES.length]} />
          </div>
        ))}
      </div>

      <Link
        to="/shops"
        className="mt-6 flex items-center gap-1 text-xs uppercase tracking-[.15em] text-[var(--forest)]/70 sm:hidden"
      >
        More products <ArrowRight size={14} />
      </Link>
    </section>
  );
}
