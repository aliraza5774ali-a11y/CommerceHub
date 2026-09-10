import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BarChart3,
  Boxes,
  CreditCard,
  Globe2,
  Palette,
  ShieldCheck,
  Sparkle,
} from "lucide-react";
import PlatformSectionHeader from "./PlatformSectionHeader";

const FEATURES = [
  {
    icon: <Palette size={18} strokeWidth={1.75} />,
    title: "Storefronts & themes",
    description:
      "Ship a polished, on-brand storefront out of the box with a customizable theme, hero, and homepage sections.",
  },
  {
    icon: <Boxes size={18} strokeWidth={1.75} />,
    title: "Products & inventory",
    description:
      "Manage catalog, variants and stock levels from one admin dashboard as orders come in.",
  },
  {
    icon: <CreditCard size={18} strokeWidth={1.75} />,
    title: "Orders & payments",
    description:
      "Accept payments and track every order from checkout to fulfillment without extra tooling.",
  },
  {
    icon: <Globe2 size={18} strokeWidth={1.75} />,
    title: "Your own domain",
    description:
      "Every store gets a dedicated storefront address, ready to connect to a custom domain.",
  },
  {
    icon: <BarChart3 size={18} strokeWidth={1.75} />,
    title: "Store analytics",
    description:
      "Keep an eye on customers, orders and store performance from a single overview.",
  },
  {
    icon: <ShieldCheck size={18} strokeWidth={1.75} />,
    title: "Roles & permissions",
    description:
      "Invite owners, admins and staff with the right level of access to run the business safely.",
  },
];

const FeatureGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="features"
      className="scroll-mt-24 w-full bg-[#f8f8f8] px-4 py-16 sm:px-6 sm:py-20 md:px-10 lg:px-16 xl:px-28"
    >
      <div className="mx-auto max-w-7xl">
        <PlatformSectionHeader
          badge="What you get"
          icon={<Sparkle size={12} strokeWidth={2} />}
          heading="Everything a modern store needs, already built in"
        />

        <div
          ref={ref}
          className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group soft-lift flex flex-col gap-4 rounded-3xl border border-black/8 bg-white p-7 shadow-sm transition-all duration-300 hover:border-black/15"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/20 text-black transition-colors duration-300 group-hover:bg-accent group-hover:text-black">
                {feature.icon}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-black">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-black/55">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;