import { Link } from "react-router-dom";
import { LUXE_CATEGORIES } from "../data/products";

export default function CategoryStrip() {
  return (
    <section className="border-y border-[var(--line)] px-5 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl justify-between gap-6 overflow-x-auto">
        {LUXE_CATEGORIES.map((c) => (
          <Link key={c.name} to="/shops" className="flex shrink-0 flex-col items-center gap-2 text-center">
            <div className="h-16 w-16 overflow-hidden rounded-full sm:h-20 sm:w-20">
              <img src={c.image} alt="" className="h-full w-full object-cover" />
            </div>
            <p className="text-sm">{c.name}</p>
            <p className="text-xs text-[var(--ink-soft)]">{c.count}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
