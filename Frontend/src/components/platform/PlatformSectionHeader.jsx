import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";

const PlatformSectionHeader = ({ badge, icon, heading, ctaLabel, ctaLink, ctaOnClick }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8"
    >
      <div className="flex max-w-2xl flex-col gap-4">
        {badge && (
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-black/8 bg-black/[0.02] py-1 pl-1 pr-3 shadow-sm">
            {icon && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#cfff04]/20 text-black">
                {icon}
              </span>
            )}
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-black/50">
              {badge}
            </span>
          </span>
        )}

        <h2 className="font-display text-[clamp(2rem,4vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.01em] text-black">
          {heading}
        </h2>
      </div>

      {ctaLabel &&
        (ctaLink ? (
          <Link
            to={ctaLink}
            className="inline-flex w-fit shrink-0 items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            {ctaLabel}
          </Link>
        ) : (
          <button
            onClick={ctaOnClick}
            className="inline-flex w-fit shrink-0 items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            {ctaLabel}
          </button>
        ))}
    </motion.div>
  );
};

export default PlatformSectionHeader;