import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ShoppingBag } from "lucide-react";
import { addItem } from "../../../store/slice/cartSlice";
import { openCart } from "../../../store/slice/Uislice";

export default function ProductCard({ product, tag }) {
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
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--sand)]">
        {tag && <span className="luxe-tag absolute left-3 top-3 z-10">{tag}</span>}
        <img
          src={product.img1}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <button
          onClick={quickAdd}
          aria-label={`Add ${product.title} to bag`}
          className="luxe-icon-btn absolute bottom-3 right-3 bg-[var(--paper)] opacity-0 shadow transition-opacity duration-200 group-hover:opacity-100"
        >
          <ShoppingBag size={15} />
        </button>
      </div>
      <div className="pt-3">
        <h3 className="text-sm">{product.title}</h3>
        <div className="mt-1 flex items-center gap-2 text-sm">
          <span className="font-medium">{product.price}</span>
          {product.discount && <s className="text-[var(--ink-soft)]">{product.discount}</s>}
        </div>
      </div>
    </Link>
  );
}
