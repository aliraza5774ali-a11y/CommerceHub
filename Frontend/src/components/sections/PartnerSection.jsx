import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";

const AVATARS = [
  "https://framerusercontent.com/images/xjBP37MgaLIT2MdXe0Kl896XmbM.png?width=80&height=80",
  "https://framerusercontent.com/images/V6kvRnK4tvwVKtnM3SDW7g4T9I.png?width=80&height=80",
  "https://framerusercontent.com/images/8Y1Vd6ysDPyE3ONSfgw125SCPw.png?width=80&height=80",
  "https://framerusercontent.com/images/qL5xOqMFC6yF35qSRHaAWJGZQKU.png?width=80&height=80",
  "https://framerusercontent.com/images/G8RDO1PQndTWIrwwR6NkSGjho.png?width=80&height=80",
];

const LOGOS = [
  { src: "https://framerusercontent.com/images/4I0nUFgLGKqAqwEE0S5l6yrCXzQ.svg?width=132&height=35", w: 132, h: 35 },
  { src: "https://framerusercontent.com/images/K7N7aNahky7BhBGyGdXp7oSDc.svg?width=100&height=51", w: 100, h: 51 },
  { src: "https://framerusercontent.com/images/UsU6TSwGi1GYzawTJkBdu5BNeqg.svg?width=105&height=40", w: 105, h: 40 },
  { src: "https://framerusercontent.com/images/Qifbcz2UjIveHTCuImUZcqT9kZg.svg?width=140&height=30", w: 140, h: 30 },
  { src: "https://framerusercontent.com/images/6QEz8kJbwqWFzbNDcgcMwaBk7Jk.svg?width=176&height=40", w: 176, h: 40 },
];

const PartnersSection = ({
  avatars = AVATARS,
  logos = LOGOS,
  rating = "4.9/5",
  ratingColor = "#ff6a00",
  trustText = "Trusted by 1k+ customers",
  tickerSpeed = 30,
  bg = "bg-[#f8f8f8]",
}) => {
  const tickerLogos = [...logos, ...logos, ...logos, ...logos, ...logos];
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section ref={sectionRef} className={`w-full ${bg} overflow-hidden`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between md:px-10 lg:px-16 xl:px-28 md:py-6 border-b border-black/6"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-5">
          <div className="flex items-center">
            {avatars.map((src, i) => (
              <div
                key={i}
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-white"
                style={{
                  marginLeft: i > 0 ? "-10px" : 0,
                  zIndex: avatars.length - i,
                }}
              >
                <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>

          <div className="hidden md:block w-px h-5 bg-black/10" />

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  fill={ratingColor}
                  stroke={ratingColor}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-black/40">{rating}</span>
          </div>

          <div className="hidden md:block w-px h-5 bg-black/10" />

          <span className="text-xs font-medium text-black/60 tracking-wide">
            {trustText}
          </span>
        </div>

        <div
          className="relative hidden md:block overflow-hidden"
          style={{
            width: "480px",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
          }}
        >
          <motion.ul
            className="flex items-center gap-10 will-change-transform"
            animate={{ x: [0, `-${logos.length * 180}px`] }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: tickerSpeed,
              ease: "linear",
            }}
          >
            {tickerLogos.map((logo, i) => (
              <li
                key={i}
                className="flex-shrink-0 flex items-center justify-center"
                style={{ width: logo.w, height: 36 }}
              >
                <img
                  src={logo.src}
                  alt=""
                  className="w-full h-full object-contain opacity-30 hover:opacity-70 transition-opacity duration-300"
                  loading="lazy"
                />
              </li>
            ))}
          </motion.ul>
        </div>
      </motion.div>
    </section>
  );
};

export default PartnersSection;