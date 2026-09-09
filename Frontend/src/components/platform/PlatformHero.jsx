import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import HeroProductDemo from "./HeroProductDemo";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = (reduced) => ({
  hidden: { opacity: 0, y: reduced ? 0 : 18, filter: reduced ? "none" : "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
});

const lineReveal = (reduced) => ({
  hidden: { y: reduced ? 0 : "110%" },
  show: {
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
});

const PlatformHero = () => {
  const prefersReducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white pb-24 pt-24 text-black sm:pb-32 sm:pt-32">
      {/* atmosphere: faint grid + radial glow, no color */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 20%, black 40%, transparent 90%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px]"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(207,255,4,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(to top, #ffffff 0%, transparent 100%)" }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate={ready ? "show" : "hidden"}
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center sm:px-10"
      >
        <h1 className="font-display text-[clamp(1.9rem,7.2vw,5rem)] font-semibold leading-[1.05] tracking-[-0.01em] text-black">
          <span className="block overflow-hidden">
            <motion.span variants={lineReveal(prefersReducedMotion)} className="block whitespace-nowrap">
              One platform for your
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span variants={lineReveal(prefersReducedMotion)} className="block whitespace-nowrap">
              store, sales, and growth.
            </motion.span>
          </span>
        </h1>

        <motion.p
          variants={item(prefersReducedMotion)}
          className="mx-auto mt-6 max-w-xl px-2 text-[15px] leading-relaxed text-black/55 sm:px-0 sm:text-base"
        >
          Build your storefront, manage products and inventory, process
          orders, and grow your business from one powerful platform.
        </motion.p>

        <motion.div
          variants={item(prefersReducedMotion)}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Link
            to="/open-store"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-black/70 bg-white px-7 py-3.5 text-[14px] font-semibold text-black transition-all duration-300 hover:border-black hover:bg-black/[0.03] active:scale-[0.97]"
          >
            Open Your Store
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-7 py-3.5 text-[14px] font-medium text-white shadow-sm transition-all duration-300 hover:bg-neutral-800 active:scale-[0.97]"
          >
            See How It Works
          </a>
        </motion.div>
      </motion.div>

      <div className="relative z-10 mx-auto mt-12 max-w-6xl px-4 sm:mt-14 sm:px-8">
        <HeroProductDemo />
      </div>
    </section>
  );
};

export default PlatformHero;