import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Rocket, Store, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import PlatformSectionHeader from "./PlatformSectionHeader";

const STEPS = [
  {
    icon: <Store size={20} strokeWidth={1.75} />,
    step: "01",
    title: "Name your store",
    description:
      "Pick a store name and a slug — that becomes your storefront's address on CommerceHub.",
  },
  {
    icon: <UserRound size={20} strokeWidth={1.75} />,
    step: "02",
    title: "Create your owner account",
    description:
      "Set up the account you'll use to sign in and manage everything from the admin dashboard.",
  },
  {
    icon: <Rocket size={20} strokeWidth={1.75} />,
    step: "03",
    title: "Go live",
    description:
      "Your storefront is provisioned instantly — start adding products and taking orders right away.",
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:px-10 lg:px-16 xl:px-28"
    >
      <div className="mx-auto max-w-7xl">
        <PlatformSectionHeader
          badge="How it works"
          icon={<Rocket size={12} strokeWidth={2} />}
          heading="Three steps between you and an open store"
        />

        <div ref={ref} className="relative mt-12 sm:mt-14">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="soft-lift relative flex flex-col gap-4 rounded-3xl border border-black/8 bg-white p-7 shadow-sm transition-colors duration-300 hover:border-black/15"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/20 text-black">
                    {step.icon}
                  </span>
                  <span className="font-price text-3xl font-bold text-black/[0.08]">
                    {step.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-black">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-black/55">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/open-store"
            className="group inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-[14px] font-medium text-white shadow-sm transition-all duration-300 hover:bg-neutral-800 active:scale-[0.97]"
          >
            Start with step one
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;