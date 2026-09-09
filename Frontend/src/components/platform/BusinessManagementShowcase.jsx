import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Gauge, Package, Users2, Wallet } from "lucide-react";
import PlatformSectionHeader from "./PlatformSectionHeader";

const CARDS = [
  { icon: <Wallet size={16} strokeWidth={1.75} />, label: "Orders", note: "Track every order from checkout to fulfillment" },
  { icon: <Package size={16} strokeWidth={1.75} />, label: "Products & inventory", note: "Manage your catalog and stock in one place" },
  { icon: <Users2 size={16} strokeWidth={1.75} />, label: "Customers", note: "See customer accounts and activity" },
];

const BusinessManagementShowcase = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-24 md:px-10 lg:px-16 xl:px-28">
      <div className="mx-auto max-w-7xl">
        <PlatformSectionHeader
          badge="Business management"
          icon={<Gauge size={12} strokeWidth={2} />}
          heading="Everything under control"
        />

        <div
          ref={ref}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="soft-lift flex flex-col gap-4 rounded-3xl border border-black/8 bg-white p-7 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#cfff04]/20 text-black">
                {card.icon}
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-black">
                  {card.label}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-black/55">
                  {card.note}
                </p>
              </div>

              {/* mini UI representation */}
              <div className="mt-1 flex flex-col gap-1.5 rounded-xl bg-black/[0.03] p-3">
                {[0, 1, 2].map((row) => (
                  <div key={row} className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-md bg-black/[0.06]" />
                    <span
                      className="h-2 rounded-full bg-black/[0.08]"
                      style={{ width: `${60 - row * 12}%` }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessManagementShowcase;