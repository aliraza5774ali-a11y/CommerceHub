import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import shopVideo from "../../assets/video_shop.mp4";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-24 md:px-10 lg:px-16 xl:px-28">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-black/8 bg-[#f8f8f8] px-6 py-14 text-center shadow-md sm:px-10 sm:py-20"
      >
        <video
          src={shopVideo}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.14]"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(207,255,4,0.16) 0%, transparent 60%)",
          }}
        />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl font-display text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.01em] text-black">
            Ready to open your store?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-black/55">
            Create your store, its owner account, and its domain in one
            guided step. No setup calls, no waiting.
          </p>
          <div className="mt-9 flex justify-center">
            <Link
              to="/open-store"
              className="group inline-flex items-center gap-2 rounded-full bg-[#cfff04] px-8 py-3.5 text-[14px] font-semibold text-black shadow-sm transition-all duration-300 hover:bg-[#bce800] active:scale-[0.97]"
            >
              Open a Store
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;