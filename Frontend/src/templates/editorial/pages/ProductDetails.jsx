import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Minus, Plus } from "lucide-react";
import { getDummyProduct } from "../data/products";
import { addItem } from "../../../store/slice/cartSlice";
import { openCart } from "../../../store/slice/Uislice";

export default function EditorialProductDetails() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [active, setActive] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setActive(0);
    setProduct(getDummyProduct(slug));
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-[60vh] p-20 text-center">
        <p className="editorial-display text-3xl">Product not found.</p>
        <Link to="/shops" className="mt-5 inline-block underline">Return to the shop</Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.img1];
  const name = product.name || product.title;
  const price = Number(String(product.price).replace(/[^0-9.]/g, ""));
  const add = () => {
    dispatch(addItem({ id: product.slug, name, image: images[0], price, quantity }));
    dispatch(openCart());
  };

  return (
    <section className="px-5 pb-16 pt-28 sm:px-10 lg:px-16">
      <Link to="/shops" className="text-xs uppercase tracking-[.18em] text-[var(--coral)]">Back to shop</Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <div className="aspect-[4/5] overflow-hidden rounded-xl bg-[var(--paper-dim)]">
            <img src={images[active]} alt={name} className="h-full w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="editorial-scrollbar mt-3 flex gap-3 overflow-x-auto">
              {images.map((image, i) => (
                <button key={`${image}-${i}`} onClick={() => setActive(i)} className={`h-24 w-20 shrink-0 overflow-hidden rounded-lg ${i === active ? "ring-2 ring-[var(--coral)]" : "opacity-60"}`}>
                  <img src={image} alt={`${name} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="lg:pt-10">
          <p className="text-xs uppercase tracking-[.2em] text-[var(--coral)]">{product.category || "Collection"}</p>
          <h1 className="editorial-display mt-4 text-5xl leading-none sm:text-6xl">{name}</h1>
          <div className="mt-5 flex gap-3">
            <span className="text-lg">{product.price}</span>
            {product.discount && <s className="text-[var(--forest)]/50">{product.discount}</s>}
          </div>
          {product.description && <p className="mt-8 max-w-md leading-7 text-[var(--forest)]/75">{product.description}</p>}
          <div className="mt-9 flex gap-3">
            <div className="flex items-center border border-[var(--forest)]/35">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-3" aria-label="Decrease quantity"><Minus size={16} /></button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="p-3" aria-label="Increase quantity"><Plus size={16} /></button>
            </div>
            <button onClick={add} className="bg-[var(--forest)] px-7 text-xs uppercase tracking-[.16em] text-[var(--paper)] hover:bg-[var(--coral)]">Add to bag</button>
          </div>
          <dl className="mt-10 divide-y divide-[var(--forest)]/15 border-y border-[var(--forest)]/15">
            {product.material && (
              <div className="py-4">
                <dt className="text-xs uppercase tracking-[.15em]">Material</dt>
                <dd className="mt-1 text-sm text-[var(--forest)]/70">{product.material}</dd>
              </div>
            )}
            {product.care && (
              <div className="py-4">
                <dt className="text-xs uppercase tracking-[.15em]">Care</dt>
                <dd className="mt-1 text-sm text-[var(--forest)]/70">{product.care}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </section>
  );
}
