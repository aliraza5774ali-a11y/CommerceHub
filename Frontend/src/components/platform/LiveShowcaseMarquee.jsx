import product01 from "../../assets/product_01.avif";
import product02 from "../../assets/product_02.avif";
import product03 from "../../assets/product_03.avif";
import product04 from "../../assets/product_04.avif";
import product05 from "../../assets/product_05.avif";
import product06 from "../../assets/product_06.avif";
import collection01 from "../../assets/collection_01.avif";
import collection02 from "../../assets/collection_02.avif";

const SHOWCASE_IMAGES = [
  product01,
  collection01,
  product02,
  product03,
  collection02,
  product04,
  product05,
  product06,
];

// Duplicated once so the CSS translateX(-50%) loop is seamless.
const TRACK_IMAGES = [...SHOWCASE_IMAGES, ...SHOWCASE_IMAGES];

const LiveShowcaseMarquee = () => {
  return (
    <section
      aria-label="Storefronts built on CommerceHub"
      className="w-full overflow-hidden border-y border-black/8 bg-[#f8f8f8] py-10 sm:py-12"
    >
      <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-black/35">
        What a CommerceHub storefront looks like
      </p>

      <div className="relative">
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#f8f8f8] to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#f8f8f8] to-transparent sm:w-28" />

        <div className="marquee-track flex w-max animate-[marquee-left_32s_linear_infinite] gap-4 hover:[animation-play-state:paused] sm:gap-5">
          {TRACK_IMAGES.map((src, i) => (
            <div
              key={i}
              className="h-36 w-28 shrink-0 overflow-hidden rounded-2xl border border-black/8 shadow-md sm:h-44 sm:w-36"
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveShowcaseMarquee;