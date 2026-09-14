import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Crown, Heart, Layers, Users, InfinityIcon } from "lucide-react";

const CARDS = [
  {
    image: "https://framerusercontent.com/images/pEBq80I4IeHuPWY6F4zlaCYPo.png?width=600&height=600",
    icon: <InfinityIcon size={18} strokeWidth={1.5} className="text-white" />,
    stat: "10M+",
    label: "Pieces worn daily",
  },
  {
    image: "https://framerusercontent.com/images/gXeXEdJCGwcyaYKiWNSbF2Wf5Yg.jpeg?width=405&height=720",
    icon: <Heart size={18} strokeWidth={1.5} className="text-white" />,
    stat: "98%",
    label: "Customer Satisfaction",
  },
  {
    image: "https://framerusercontent.com/images/nvGX8w2EmNhLJbIVjLMsGKTV4I.jpeg?width=640&height=640",
    icon: <Layers size={18} strokeWidth={1.5} className="text-white" />,
    stat: "300+",
    label: "Essential Styles",
  },
  {
    image: "https://framerusercontent.com/images/k4gwIeU3rPPXIyxSMgWszrewfy8.png?width=600&height=452",
    icon: <Users size={18} strokeWidth={1.5} className="text-white" />,
    stat: "500K+",
    label: "Community worldwide",
  },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="w-full bg-[#f8f8f8] px-4 py-12 sm:px-6 md:px-10 lg:px-16 xl:px-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center gap-4 sm:gap-6 mb-10 sm:mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-black/6 shadow-sm">
            <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center">
              <Crown size={13} className="text-white" strokeWidth={1.5} />
            </div>
            <span className="font-mono text-xs text-black tracking-wide">
              About Velour
            </span>
          </div>

          <p className="text-xl sm:text-2xl md:text-3xl font-medium text-black leading-relaxed tracking-normal max-w-2xl">
            More than fashion — a commitment to intentional design. Sleek
            silhouettes, modern ease, your personal journey.
          </p>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {CARDS.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-2xl cursor-pointer aspect-[3/4] min-h-[280px] sm:min-h-0"
            >
              <img
                src={card.image}
                alt={card.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />

              <div
                className="absolute inset-0 z-10"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.75) 100%)",
                  maskImage:
                    "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.95) 60%, black 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.95) 60%, black 100%)",
                }}
              />

              <div className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-5 flex flex-col items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backdropFilter: "blur(8px)",
                    backgroundColor: "rgba(255,255,255,0.15)",
                  }}
                >
                  {card.icon}
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-price text-2xl sm:text-3xl font-bold text-white tabular-nums">
                    {card.stat}
                  </span>
                  <span className="text-xs text-white/80 font-medium text-center">
                    {card.label}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;