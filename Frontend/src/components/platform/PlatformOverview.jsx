import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import PlatformSectionHeader from "./PlatformSectionHeader";
import storeHero from "../../assets/collection_01.avif";
import storeProduct01 from "../../assets/product_04.avif";
import storeProduct02 from "../../assets/product_05.avif";
import storeProduct03 from "../../assets/product_06.avif";

const PlatformOverview = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="w-full bg-[#f8f8f8] px-4 py-16 sm:px-6 sm:py-24 md:px-10 lg:px-16 xl:px-28">
      <div className="mx-auto max-w-7xl">
        <PlatformSectionHeader
          badge="Platform overview"
          icon={<LayoutDashboard size={12} strokeWidth={2} />}
          heading="One platform for your entire store"
        />

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-14 flex flex-col items-center"
        >
          {/* Dashboard card */}
          <div className="soft-lift w-full max-w-3xl overflow-hidden rounded-3xl border border-black/8 bg-white shadow-md">
            <div className="flex items-center gap-1.5 border-b border-black/8 bg-black/[0.02] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
              <span className="ml-3 flex-1 truncate rounded-full bg-black/[0.04] px-3 py-1 text-center font-mono text-[10px] text-black/35">
                admin.yourstore.commercehub.com/dashboard
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
              {["Sales", "Orders", "Products", "Inventory", "Customers", "Payments", "Analytics", "Settings"].map(
                (label, i) => (
                  <div
                    key={label}
                    className={`flex flex-col gap-2 rounded-xl border p-3.5 ${
                      i === 0
                        ? "border-black/8 bg-accent/15 text-black"
                        : "border-black/6 bg-black/[0.02] text-black/60"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-8 rounded-full ${
                        i === 0 ? "bg-accent" : "bg-black/10"
                      }`}
                    />
                    <span className="text-[12px] font-medium">{label}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Floating storefront card */}
          <div className="relative -mt-10 w-56 self-start rounded-3xl border border-black/8 bg-white p-3 shadow-md sm:absolute sm:bottom-0 sm:left-8 sm:mt-0">
            <p className="mb-2 px-1 text-[11px] font-medium text-black/50">
              Your Store
            </p>
            <div className="h-16 overflow-hidden rounded-lg">
              <img src={storeHero} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {[storeProduct01, storeProduct02, storeProduct03].map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg bg-black/[0.04]">
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <p className="mx-auto mt-14 max-w-lg text-center text-[15px] leading-relaxed text-black/55 sm:mt-10">
          Storefront, admin dashboard and business management — connected
          from day one, so you're never stitching separate tools together.
        </p>
      </div>
    </section>
  );
};

export default PlatformOverview;