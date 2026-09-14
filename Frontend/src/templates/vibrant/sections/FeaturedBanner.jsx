import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { getVibrantProducts } from "../data/products";
import { useTenant } from "../../../components/TenantProvider";

export default function FeaturedBanner() {
  const { tenant } = useTenant();
  const product = getVibrantProducts().find((p) => p.slug === "cashmere-blend-scarf") || getVibrantProducts()[0];

  return (
    <section className="px-5 py-10 sm:px-10 lg:px-16">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--sun)] to-amber-400 px-6 py-16 sm:px-14">
        <p className="vibrant-badge bg-black/10">/Featured</p>
        <h2
          className="vibrant-display mt-2 select-none text-[18vw] leading-none text-white/90 sm:text-8xl"
        >
          {tenant?.name || "Frolax"}
        </h2>

        <div className="relative mx-auto -mt-8 max-w-md sm:mt-0">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl">
            <img src={product.img1} alt={product.title} className="h-full w-full object-cover" />
          </div>
          <div className="absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-center text-[10px] font-bold uppercase leading-tight text-[var(--sun)] shadow-lg">
            Quality<br />Product
          </div>
          <Link
            to={`/shop/${product.slug}`}
            className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-lg"
          >
            <div>
              <p className="text-xs font-semibold">{product.title}</p>
              <p className="text-xs text-[var(--ink-soft)]">{product.price}</p>
            </div>
            <span className="vibrant-icon-btn h-8 w-8 bg-[var(--sun)] text-white"><ArrowUpRight size={14} /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
