import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, LayoutTemplate } from "lucide-react";

const POINTS = [
  "Responsive storefront — homepage, collections, product pages and checkout, all functional from day one",
  "Consistent design system carried across every page of your store",
  "Admin dashboard to manage products, orders, customers and settings",
];

const StorefrontShowcase = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="showcase"
      ref={ref}
      className="scroll-mt-24 w-full bg-white px-4 py-16 sm:px-6 sm:py-24 md:px-10 lg:px-16 xl:px-28"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-black/[0.02] py-1.5 pl-1.5 pr-3 shadow-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-black">
              <LayoutTemplate size={12} strokeWidth={2.25} />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-black/55">
              Storefront
            </span>
          </span>

          <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.01em] text-black">
            Every store ships premium, end to end
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-black/55">
            Your customers get a fast, fully working shopping experience.
            You get one dashboard to run it — no piecing together separate
            tools for products, orders and payments.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span className="text-sm leading-relaxed text-black/65">{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Mock preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="overflow-hidden rounded-3xl border border-black/8 bg-white shadow-md">
            <div className="flex items-center gap-1.5 bg-black/[0.03] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
              <span className="ml-3 flex-1 truncate rounded-full bg-black/[0.04] px-3 py-1 text-center font-mono text-[10px] text-black/35">
                admin.yourstore.commercehub.com
              </span>
            </div>
            <div className="grid grid-cols-[88px_1fr] bg-[#f8f8f8] sm:grid-cols-[104px_1fr]">
              {/* fake sidebar */}
              <div className="flex flex-col gap-2 border-r border-black/5 bg-white px-2.5 py-4">
                <span className="mb-2 h-2 w-10 rounded-full bg-black/10" />
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={`h-6 rounded-md ${i === 1 ? "bg-black" : "bg-black/5"}`}
                  />
                ))}
              </div>
              {/* fake content */}
              <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="h-3 w-24 rounded-full bg-black/15" />
                  <span className="h-6 w-16 rounded-full bg-black" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="rounded-lg bg-white p-2.5 shadow-sm">
                      <span className="block h-1.5 w-1/2 rounded-full bg-black/10" />
                      <span className="mt-2 block h-3 w-3/4 rounded-full bg-black/70" />
                    </div>
                  ))}
                </div>
                <div className="mt-1 flex-1 rounded-lg bg-white p-3 shadow-sm">
                  <div className="flex flex-col gap-2">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-md bg-black/5" />
                        <span className="h-2 flex-1 rounded-full bg-black/8" />
                        <span className="h-2 w-10 rounded-full bg-black/10" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-accent/10 blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
};

export default StorefrontShowcase;