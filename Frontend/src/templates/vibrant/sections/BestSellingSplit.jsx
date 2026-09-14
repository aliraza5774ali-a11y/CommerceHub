import { Link } from "react-router-dom";

const PANELS = [
  { image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80", caption: "Redefine your office wear with sophisticated and versatile pieces.", size: "large" },
  { image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80", caption: "Effortless styles designed for comfort and adventure.", size: "small" },
  { image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80", caption: "High-performance gear for every movement.", size: "small" },
];

export default function BestSellingSplit() {
  return (
    <section className="px-5 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl items-end justify-between">
        <p className="vibrant-display text-2xl leading-tight">Explore Best<br />Selling Product</p>
        <Link to="/shops" className="text-sm text-[var(--sun)]">Browse All Products →</Link>
      </div>
      <div className="mx-auto mt-6 grid max-w-7xl gap-4">
        <div className="group relative aspect-[16/8] overflow-hidden rounded-2xl">
          <img src={PANELS[0].image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <p className="absolute bottom-5 left-5 max-w-xs text-lg text-white">{PANELS[0].caption}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {PANELS.slice(1).map((p) => (
            <div key={p.caption} className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
              <img src={p.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-5 left-5 max-w-[85%] text-white">{p.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
