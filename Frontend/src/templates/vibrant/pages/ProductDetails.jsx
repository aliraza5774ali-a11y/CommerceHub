import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Minus, Plus, Star } from "lucide-react";
import { getVibrantProduct } from "../data/products";
import { addItem } from "../../../store/slice/cartSlice";
import { openCart } from "../../../store/slice/Uislice";

export default function VibrantProductDetails() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setProduct(getVibrantProduct(slug));
    setQuantity(1);
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-[60vh] p-20 text-center">
        <p className="vibrant-display text-2xl">Product not found.</p>
        <Link to="/shops" className="mt-5 inline-block text-[var(--sun)] underline">Return to the shop</Link>
      </div>
    );
  }

  const price = Number(String(product.price).replace(/[^0-9.]/g, ""));
  const add = () => {
    dispatch(addItem({ id: product.slug, name: product.title, image: product.img1, price, quantity }));
    dispatch(openCart());
  };

  return (
    <section className="px-5 pb-16 pt-10 sm:px-10 lg:px-16">
      <p className="text-xs text-[var(--ink-soft)]">
        <Link to="/">Home</Link> / <Link to="/shops">Shop</Link>
      </p>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-white">
          <img src={product.img1} alt={product.title} className="h-full w-full object-cover" />
        </div>
        <div className="lg:pt-6">
          <p className="vibrant-badge bg-[var(--sun)]/10 text-[var(--sun)]">{product.category}</p>
          <h1 className="vibrant-display mt-4 text-3xl sm:text-4xl">{product.title}</h1>
          {product.rating && (
            <div className="mt-2 flex items-center gap-1 text-sm text-[var(--ink-soft)]">
              <Star size={14} className="fill-[var(--sun)] text-[var(--sun)]" />
              {product.rating} · {product.reviews} Reviews
            </div>
          )}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xl font-semibold">{product.price}</span>
            {product.discount && <s className="text-[var(--ink-soft)]">{product.discount}</s>}
          </div>
          {product.description && <p className="mt-5 max-w-md leading-7 text-[var(--ink-soft)]">{product.description}</p>}

          <div className="mt-7 flex gap-3">
            <div className="flex items-center rounded-full bg-white px-1">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-3" aria-label="Decrease quantity"><Minus size={16} /></button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="p-3" aria-label="Increase quantity"><Plus size={16} /></button>
            </div>
            <button onClick={add} className="vibrant-btn vibrant-btn-solid flex-1">Add to Cart</button>
          </div>

          <dl className="mt-8 divide-y divide-[var(--line)] rounded-2xl bg-white px-5">
            {product.material && (
              <div className="py-4">
                <dt className="text-xs uppercase tracking-[.1em] text-[var(--ink-soft)]">Material</dt>
                <dd className="mt-1 text-sm">{product.material}</dd>
              </div>
            )}
            {product.care && (
              <div className="py-4">
                <dt className="text-xs uppercase tracking-[.1em] text-[var(--ink-soft)]">Care</dt>
                <dd className="mt-1 text-sm">{product.care}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </section>
  );
}
