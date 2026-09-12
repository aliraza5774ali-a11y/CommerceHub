import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ShoppingBag } from "lucide-react";
import { editorialImages } from "../placeholderImages";
import { addItem } from "../../../store/slice/cartSlice";
import { openCart } from "../../../store/slice/Uislice";

export default function ProductCard({ product, badge }) {
  const dispatch = useDispatch();

  const quickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const price = Number(String(product.price).replace(/[^0-9.]/g, ""));
    dispatch(
      addItem({
        id: product.slug,
        name: product.title,
        image: product.img1,
        price,
        quantity: 1,
      })
    );
    dispatch(openCart());
  };

  return (
    <Link to={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[var(--paper-dim)]">
        {badge && (
          <span className="editorial-badge absolute left-3 top-3 z-10 bg-[var(--forest)] text-[var(--paper)]">
            {badge}
          </span>
        )}
        <img
          src={product.img1 || editorialImages.galleryFallback}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex items-end justify-between gap-3 pt-3">
        <div>
          <p className="text-xs uppercase tracking-[.14em] text-[var(--forest)]/55">
            {product.category || "Collection"}
          </p>
          <h3 className="mt-1 text-[.95rem] leading-snug">{product.title}</h3>
          <div className="mt-1 flex items-center gap-2 text-sm">
            <span className="font-medium">{product.price}</span>
            {product.discount && (
              <s className="text-[var(--forest)]/40">{product.discount}</s>
            )}
          </div>
        </div>
        <button
          onClick={quickAdd}
          aria-label={`Add ${product.title} to cart`}
          className="editorial-pill bg-[var(--forest)] !px-3 !py-3 text-[var(--paper)] hover:bg-[var(--coral)]"
        >
          <ShoppingBag size={15} />
        </button>
      </div>
    </Link>
  );
}
