import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { addItem } from "../../../store/slice/cartSlice";
import { openCart } from "../../../store/slice/Uislice";

export default function ProductCard({ product, badge }) {
  const dispatch = useDispatch();

  const quickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const price = Number(String(product.price).replace(/[^0-9.]/g, ""));
    dispatch(addItem({ id: product.slug, name: product.title, image: product.img1, price, quantity: 1 }));
    dispatch(openCart());
  };

  return (
    <Link to={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-white">
        {badge && <span className="vibrant-badge absolute left-2 top-2 z-10 bg-[var(--sun)] text-white">{badge}</span>}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          aria-label="Add to wishlist"
          className="vibrant-icon-btn absolute right-2 top-2 z-10 h-8 w-8"
        >
          <Heart size={13} />
        </button>
        <img src={product.img1} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <button
          onClick={quickAdd}
          className="vibrant-btn vibrant-btn-solid absolute inset-x-2 bottom-2 translate-y-8 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ShoppingBag size={13} /> Add to Cart
        </button>
      </div>
      <div className="pt-3">
        <h3 className="text-sm font-medium">{product.title}</h3>
        {product.rating && (
          <div className="mt-1 flex items-center gap-1 text-xs text-[var(--ink-soft)]">
            <Star size={12} className="fill-[var(--sun)] text-[var(--sun)]" />
            {product.rating} · {product.reviews} Reviews
          </div>
        )}
        <div className="mt-1 flex items-center gap-2 text-sm">
          <span className="font-semibold">{product.price}</span>
          {product.discount && <s className="text-[var(--ink-soft)]">{product.discount}</s>}
        </div>
      </div>
    </Link>
  );
}
