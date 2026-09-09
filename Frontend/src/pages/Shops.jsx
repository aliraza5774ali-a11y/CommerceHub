import { useState } from "react";
import HeroSection from "../components/sections/HeroSection";
import SampleProduct from "../components/SampleProduct";
import hero01 from "../assets/shopHero.avif";
import { products as ALL_PRODUCTS } from "../data/products";
import { Leaf, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const CATEGORIES = ["All Products", ...new Set(ALL_PRODUCTS.map((p) => p.category))];

const TRUST = [
  {
    icon: <Truck size={22} strokeWidth={1.5} />,
    title: "Free Shipping",
    desc: "On all orders over $150",
  },
  {
    icon: <RotateCcw size={22} strokeWidth={1.5} />,
    title: "Easy Returns",
    desc: "30-day hassle-free returns",
  },
  {
    icon: <Leaf size={22} strokeWidth={1.5} />,
    title: "Sustainably Made",
    desc: "Ethical, eco-conscious fabrics",
  },
  {
    icon: <ShieldCheck size={22} strokeWidth={1.5} />,
    title: "Secure Checkout",
    desc: "SSL encrypted payments",
  },
];

const Shops = () => {
  const [active, setActive] = useState("All Products");

  const filtered =
    active === "All Products"
      ? ALL_PRODUCTS
      : ALL_PRODUCTS.filter((p) => p.category === active);

  return (
    <div>
      <HeroSection
  mode="shop"
  image={hero01}
  badge={{ label: "Shop", text: "Curated for you" }}
  heading="Find your perfect fit"
  subtext="Browse our latest arrivals and timeless classics"
  primaryLabel="New Arrivals"
  secondaryLabel="Best Sellers"
>
  <div className="mt-6 flex w-full max-w-md items-center gap-2 rounded-full bg-white/10 px-4 py-3 backdrop-blur-md border border-white/10">
    <svg className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      placeholder="Search products..."
      className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none"
    />
  </div>
</HeroSection>

      <div className="flex flex-col gap-8 sm:gap-10 px-4 py-10 sm:px-6 md:px-10 lg:px-16 xl:px-28">
        <div className="w-full rounded-full bg-[#eeeeee] p-1.5">
  <div className="flex w-full gap-2 overflow-x-auto sm:overflow-visible">
    {CATEGORIES.map((cat) => (
      <button
        key={cat}
        onClick={() => setActive(cat)}
        className={`min-w-max flex-1 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-base ${
          active === cat
            ? "bg-black text-white shadow-sm"
            : "bg-white text-black hover:bg-black/5"
        }`}
      >
        {cat}
      </button>
    ))}
  </div>
</div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {filtered.map((product) => (
              <SampleProduct
                key={product.slug}
                slug={product.slug}
                img1={product.img1}
                img2={product.img2}
                title={product.title}
                price={product.price}
                discount={product.discount}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 sm:py-32 gap-3">
            <p className="text-xl sm:text-2xl font-semibold text-black">
              No items found
            </p>
            <p className="text-sm text-black/40">
              Try selecting a different category
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-28">
        <p className="text-xs text-black/30 font-medium text-center">
          Showing {filtered.length} of {ALL_PRODUCTS.length} products
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 py-10 pt-6 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-28">
        {TRUST.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center gap-2 px-5 py-4 bg-[#f3f3f3] rounded-2xl"
          >
            <div className="text-2xl">{item.icon}</div>
            <p className="text-sm font-semibold text-black">{item.title}</p>
            <p className="text-xs text-black/40 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shops;