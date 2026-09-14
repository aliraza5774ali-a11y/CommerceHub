import { Link } from "react-router-dom";
import { VIBRANT_CATEGORIES } from "../data/products";

function Tile({ cat, className = "" }) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl ${className}`}>
      <img src={cat.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
      <div className="absolute bottom-4 left-4 text-white">
        <p className="vibrant-display text-xl">{cat.name}</p>
        <p className="text-xs text-white/80">{cat.tagline}</p>
        <Link to="/shops" className="vibrant-btn vibrant-btn-light mt-3 !py-2 !text-xs">View Collections</Link>
      </div>
    </div>
  );
}

export default function CategoryBento() {
  const [large, wide, small1, small2] = VIBRANT_CATEGORIES;
  return (
    <section className="px-5 py-10 sm:px-10 lg:px-16">
      <p className="vibrant-display mb-6 text-2xl">Our Categories</p>
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2">
        <Tile cat={large} className="aspect-[4/5] sm:aspect-auto sm:h-full" />
        <div className="grid gap-4 sm:grid-rows-2">
          <Tile cat={wide} className="aspect-[16/9]" />
          <div className="grid grid-cols-2 gap-4">
            <Tile cat={small1} className="aspect-square" />
            <Tile cat={small2} className="aspect-square" />
          </div>
        </div>
      </div>
    </section>
  );
}
