import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BarChart3,
  Boxes,
  CreditCard,
  LayoutTemplate,
  Package,
  Users,
} from "lucide-react";

const CAPABILITIES = [
  { icon: <LayoutTemplate size={16} strokeWidth={1.75} />, label: "Storefront" },
  { icon: <Package size={16} strokeWidth={1.75} />, label: "Products" },
  { icon: <Boxes size={16} strokeWidth={1.75} />, label: "Inventory" },
  { icon: <CreditCard size={16} strokeWidth={1.75} />, label: "Orders" },
  { icon: <Users size={16} strokeWidth={1.75} />, label: "Customers" },
  { icon: <BarChart3 size={16} strokeWidth={1.75} />, label: "Analytics" },
];

const TrustSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section className="w-full border-b border-black/8 bg-white px-4 py-10 sm:px-6 md:px-10 lg:px-16 xl:px-28">
      <div className="mx-auto max-w-7xl">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.2em] text-black/35">
          Everything you need to run your online business
        </p>
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, staggerChildren: 0.06 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-10"
        >
          {CAPABILITIES.map((c, i) => (
            <motion.span
              key={c.label}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-black/55"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#cfff04]/15 text-black">
                {c.icon}
              </span>
              {c.label}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;