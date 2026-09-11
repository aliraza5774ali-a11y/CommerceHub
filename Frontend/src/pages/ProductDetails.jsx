import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Sparkles,
  Shirt,
  Droplets,
  ShieldCheck,
  BadgeCheck,
  Lock,
  Truck,
  RotateCcw,
} from "lucide-react";
import { api } from "../api/commerceApi";
import { toDisplayProduct } from "../utils/productDisplay";
import { addItem } from "../store/slice/cartSlice";
import { openCart } from "../store/slice/Uislice";

// ─── Feature Card ──────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, description }) => (
  <div className="flex flex-col gap-3 rounded-xl bg-[#ecece9] p-5">
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
      {icon}
    </div>
    <div className="flex flex-col gap-1">
      <p className="text-sm font-semibold text-black">{title}</p>
      <p className="text-sm leading-relaxed text-black/60">{description}</p>
    </div>
  </div>
);

// ─── Spec Row ──────────────────────────────────────────────────────────────
const SpecRow = ({ icon, label, value, showLine = true }) => (
  <>
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-black/70">{icon}</span>
        <span className="text-sm font-medium text-black">{label}</span>
      </div>
      <p className="text-sm text-black/70">{value}</p>
    </div>
    {showLine && <div className="h-px w-full bg-black/10" />}
  </>
);

// ─── Default feature set (overridable via `features` prop) ────────────────
const DEFAULT_FEATURES = [
  {
    icon: <BadgeCheck size={20} />,
    title: "Trusted Quality",
    description: "Every piece is checked to ensure it meets our standards.",
  },
  {
    icon: <Lock size={20} />,
    title: "Secure Payments",
    description: "Shop confidently with our secure, encrypted checkout.",
  },
  {
    icon: <Truck size={20} />,
    title: "Real Time Tracking",
    description: "Get live updates from our warehouse to your doorstep.",
  },
  {
    icon: <RotateCcw size={20} />,
    title: "Easy Returns",
    description: "Change your mind? Return any item easily within thirty days.",
  },
];

// ─── Main Component ─────────────────────────────────────────────────────────
const ProductDetails = ({
  features = DEFAULT_FEATURES,
  breadcrumbBase = "/shop",
  ctaLabel = "Add to bag",
}) => {
  const { slug } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setActiveImage(0);
    api
      .publicProduct(slug)
      .then((item) => {
        if (active) setProduct(toDisplayProduct(item));
      })
      .catch(() => {
        if (active) setProduct(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-[#fafaf9]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-black" />
      </section>
    );
  }

  if (!product) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-white text-center">
        <p className="text-lg font-semibold text-black">Product not found</p>
        <Link to={breadcrumbBase} className="text-sm text-black/60 underline">
          Back to shop
        </Link>
      </section>
    );
  }

  const images = product.images?.length ? product.images : [product.img1, product.img2].filter(Boolean);
  const productName = product.name || product.title;
  const numericPrice = Number(String(product.price).replace(/[^0-9.]/g, ""));
  const addToBag = () => {
    dispatch(addItem({ id: product.slug, name: productName, image: images[0], price: numericPrice, quantity }));
    dispatch(openCart());
  };

  return (
    <section className="min-h-screen bg-[#fafaf9]">
      <div className="mx-auto max-w-[1200px] px-5 py-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-11">
          {/* ─── LEFT: Image Gallery ──────────────────────────────────── */}
          <div className="flex w-full flex-col gap-3 lg:w-[55%]">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#f8f8f8]">
              <img
                src={images[activeImage]}
                alt={productName}
                className="h-full w-full object-cover object-center"
              />
              {product.badge && (
                <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
                  <Sparkles size={16} />
                  <span className="text-xs font-medium text-black">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 rounded-xl bg-white p-1">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative aspect-[3/4] flex-1 overflow-hidden rounded-md transition-all ${
                      activeImage === index
                        ? "ring-1 ring-black"
                        : "ring-1 ring-transparent hover:ring-black/20"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${productName} view ${index + 1}`}
                      className="h-full w-full object-cover object-center"
                    />
                    {activeImage === index && (
                      <div className="absolute inset-0 bg-black/5" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── RIGHT: Product Details ───────────────────────────────── */}
          <div className="flex w-full flex-col gap-8 lg:w-[45%]">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
              <Link
                to={breadcrumbBase}
                className="group relative overflow-hidden rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black ring-1 ring-black/10 transition-all hover:ring-black/30"
              >
                <span className="relative z-10">Shop</span>
              </Link>
              {product.category && (
                <>
                  <div className="h-1 w-1 rounded-full bg-black/30" />
                  <span className="text-sm text-black/60">
                    {product.category}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-black">
              {productName}
            </h1>

            {/* Pricing */}
            <div className="flex items-center gap-3">
<span className="text-lg font-semibold text-black">
  {product.price}
</span>
{product.discount && (
  <div className="relative">
    <span className="text-sm text-[#a1a1a1]">
      {product.discount}
    </span>
    <div className="absolute left-0 top-1/2 h-px w-full bg-[#a1a1a1]" />
  </div>
)}
            </div>

            {/* Description + CTA */}
            <div className="flex flex-col gap-5">
              {product.description && (
                <p className="max-w-sm text-[15px] leading-relaxed text-black/60">
                  {product.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-full border border-black/15 bg-white p-1" aria-label="Quantity selector">
                  <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex h-9 w-9 items-center justify-center rounded-full text-lg transition hover:bg-black/5" aria-label="Decrease quantity">−</button>
                  <span className="w-8 text-center text-sm font-medium tabular-nums" aria-live="polite">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((value) => value + 1)} className="flex h-9 w-9 items-center justify-center rounded-full text-lg transition hover:bg-black/5" aria-label="Increase quantity">+</button>
                </div>
                <button type="button" onClick={addToBag} className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-black px-8 py-3.5 text-[15px] font-medium text-white transition-all hover:bg-black/90 active:scale-[0.97]">
                  <span className="relative z-10">{ctaLabel}</span>
                </button>
              </div>
            </div>

            {/* Specs */}
            <div className="flex flex-col gap-4 pt-2">
              {product.material && (
                <SpecRow
                  icon={<Shirt size={18} />}
                  label="Material"
                  value={product.material}
                />
              )}
              {product.care && (
                <SpecRow
                  icon={<Droplets size={18} />}
                  label="Care"
                  value={product.care}
                />
              )}
              {product.warranty && (
                <SpecRow
                  icon={<ShieldCheck size={18} />}
                  label="Warranty"
                  value={product.warranty}
                  showLine={false}
                />
              )}
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-3.5 pt-2">
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
