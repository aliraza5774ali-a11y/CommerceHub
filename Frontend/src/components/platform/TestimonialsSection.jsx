import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageCircleDashed, Star } from "lucide-react";
import review01 from "../../assets/review_01.avif";
import review02 from "../../assets/review_02.avif";
import review03 from "../../assets/review_03.avif";

const TESTIMONIALS = [
  {
    avatar: review01,
    name: "Owner, apparel brand",
    quote:
      "We had a working storefront with checkout and an admin dashboard the same afternoon we signed up. Cut weeks off our launch.",
  },
  {
    avatar: review02,
    name: "Owner, home goods store",
    quote:
      "Managing products, orders and customers from one dashboard instead of three separate tools is the difference for a small team.",
  },
  {
    avatar: review03,
    name: "Owner, accessories brand",
    quote:
      "The storefront looked premium out of the box, and moving it onto our own domain was painless.",
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const headingRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const isHeadingInView = useInView(headingRef, { once: true, margin: "-40px" });

  return (
    <section
      id="testimonials"
      className="scroll-mt-24 w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:px-10 lg:px-16 xl:px-28"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 16 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4 text-center sm:gap-5"
        >
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-black/8 bg-black/[0.02] pl-1 pr-3 py-1 shadow-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-black">
              <MessageCircleDashed size={13} />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-black/50">
              Store owners
            </span>
          </span>
          <h2 className="font-display text-[clamp(2rem,4vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.01em] text-black">
            Built by people who run stores
          </h2>
        </motion.div>

        <div ref={ref} className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="soft-lift flex flex-col gap-5 rounded-3xl border border-black/8 bg-white p-7 shadow-sm"
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={13} fill="var(--color-accent)" stroke="var(--color-accent)" strokeWidth={0} />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-black/65">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-auto flex items-center gap-3 pt-2">
                <img
                  src={t.avatar}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
                <p className="text-xs font-medium text-black/50">{t.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;