import { Link } from "react-router-dom";
import { useState } from "react";
import { Heart, Star } from "lucide-react";

export default function ProductCard({ product, highlight = false }) {
  const [liked, setLiked] = useState(false);

  return (
    <Link
      to={`/shop/${product.slug}`}
      className={`group block overflow-hidden rounded-2xl border border-[var(--line)] ${highlight ? "bg-[var(--lime)]" : "bg-white"}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {product.isNew && <span className="texart-tag absolute left-3 top-3 z-10">New</span>}
        <button
          onClick={(e) => { e.preventDefault(); setLiked((v) => !v); }}
          aria-label="Add to wishlist"
          className="texart-icon-btn absolute right-3 top-3 z-10 h-8 w-8 shadow"
        >
          <Heart size={13} className={liked ? "fill-[var(--ink)]" : ""} />
        </button>
        <img src={product.img1} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-4">
        <div className="flex text-[var(--ink)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={12} className={i < product.rating ? "fill-current" : "text-[var(--line)]"} />
          ))}
        </div>
        <h3 className="mt-2 text-sm font-medium">{product.title}</h3>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-semibold">{product.price}</p>
          {product.swatches && (
            <div className="flex -space-x-1">
              {product.swatches.map((c) => (
                <span key={c} className="h-3 w-3 rounded-full border border-white" style={{ background: c }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
