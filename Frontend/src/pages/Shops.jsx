import { useEffect, useMemo, useState } from "react";
import HeroSection from "../components/sections/HeroSection";
import SampleProduct from "../components/SampleProduct";
import hero01 from "../assets/shopHero.avif";
import { Leaf, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { api } from "../api/commerceApi";
import { toDisplayProducts } from "../utils/productDisplay";
import { useCmsHero } from "../utils/useCmsHero";

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
  const hero = useCmsHero("shops");
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("All Products");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .publicProducts()
      .then((items) => {
        if (!mounted) return;
        setAllProducts(toDisplayProducts(items));
      })
      .catch(() => {
        if (mounted) setAllProducts([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(
    () => [
      "All Products",
      ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
    ],
    [allProducts]
  );

  const filtered = useMemo(() => {
    let list =
      active === "All Products"
        ? allProducts
        : allProducts.filter((p) => p.category === active);

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }
    return list;
  }, [allProducts, active, query]);

  return (
    <div>
      <HeroSection
        mode="shop"
        image={hero.image || hero01}
        badge={{ label: hero.badgeLabel, text: hero.badgeText }}
        heading={hero.heading}
        subtext={hero.subtext}
        primaryLabel={hero.primaryLabel}
        primaryLink={hero.primaryLink}
        secondaryLabel={hero.secondaryLabel}
        secondaryLink={hero.secondaryLink}
      >
        <div className="mt-6 flex w-full max-w-md items-center gap-2 rounded-full bg-white/10 px-4 py-3 backdrop-blur-md border border-white/10">
          <svg
            className="h-5 w-5 text-white/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none"
          />
        </div>
      </HeroSection>

      <div className="flex flex-col gap-8 sm:gap-10 px-4 py-10 sm:px-6 md:px-10 lg:px-16 xl:px-28">
        {categories.length > 1 && (
          <div className="w-full rounded-full bg-[#eeeeee] p-1.5">
            <div className="flex w-full gap-2 overflow-x-auto sm:overflow-visible">
              {categories.map((cat) => (
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
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-4/5 animate-pulse rounded-3xl bg-[#ededed]"
              />
            ))}
          </div>
        ) : filtered.length > 0 ? (
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
              {allProducts.length === 0
                ? "No products have been published yet"
                : "Try selecting a different category"}
            </p>
          </div>
        )}
      </div>

      {!loading && (
        <div className="flex flex-col items-center gap-4 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-28">
          <p className="text-xs text-black/30 font-medium text-center">
            Showing {filtered.length} of {allProducts.length} products
          </p>
        </div>
      )}

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
