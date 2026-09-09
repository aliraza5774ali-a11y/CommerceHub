import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import PlatformSectionHeader from "./PlatformSectionHeader";

// NOTE: Prices below are placeholder marketing copy. Wire these to your
// real billing plans (or remove the numbers) once pricing is finalized —
// see integration notes.
const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "to open your store",
    description: "Everything you need to launch and start selling.",
    features: ["Full storefront & admin dashboard", "Unlimited products", "Standard checkout"],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$29",
    period: "/month",
    description: "For stores ready to scale traffic and orders.",
    features: ["Everything in Starter", "Custom domain", "Priority support"],
    highlighted: true,
  },
  {
    name: "Scale",
    price: "Custom",
    period: "for high-volume brands",
    description: "Dedicated support for larger catalogs and teams.",
    features: ["Everything in Growth", "Advanced roles & permissions", "Dedicated onboarding"],
    highlighted: false,
  },
];

const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="pricing"
      className="scroll-mt-24 w-full bg-[#f8f8f8] px-4 py-16 sm:px-6 sm:py-20 md:px-10 lg:px-16 xl:px-28"
    >
      <div className="mx-auto max-w-7xl">
        <PlatformSectionHeader
          badge="Pricing"
          icon={<Tag size={12} strokeWidth={2} />}
          heading="Start free. Grow when you're ready."
        />

        <div ref={ref} className="mt-12 grid grid-cols-1 gap-5 sm:mt-14 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`soft-lift flex flex-col gap-6 rounded-3xl border p-8 shadow-sm ${
                plan.highlighted
                  ? "border-[#cfff04]/40 bg-white text-black shadow-md lg:-translate-y-3"
                  : "border-black/8 bg-white text-black"
              }`}
            >
              <div>
                <h3 className="font-display text-lg font-semibold">{plan.name}</h3>
                <p
                  className={`mt-1 text-sm ${
                    "text-black/55"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="font-price text-4xl font-bold tabular-nums">
                  {plan.price}
                </span>
                <span
                  className="text-xs text-black/45"
                >
                  {plan.period}
                </span>
              </div>

              <ul className="flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                        "bg-[#cfff04]/15 text-black"
                      }`}
                    >
                      <Check size={10} strokeWidth={3} />
                    </span>
                    <span className="text-black/75">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/open-store"
                className={`mt-auto inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition active:scale-[0.97] ${
                  plan.highlighted
                    ? "bg-[#cfff04] text-black hover:bg-[#bce800]"
                    : "bg-black text-white hover:bg-neutral-800"
                }`}
              >
                Get started
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;