import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { LuSparkles } from "react-icons/lu";
import { Link } from "react-router-dom";

const SampleProduct = ({ img1, img2, title, price, discount, slug }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/shop/${slug}`}>
    <div className="group soft-lift flex cursor-pointer flex-col gap-3 rounded-3xl p-2">
      <div
        className="relative flex aspect-4/5 items-center justify-center overflow-hidden rounded-2xl bg-[#ededed]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onTouchStart={() => setHovered(true)}
        onTouchEnd={() => setHovered(false)}
      >
        <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-black shadow-sm backdrop-blur-sm">
          <LuSparkles size={11} />
          New
        </span>

        <img
          src={hovered ? img2 : img1}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
        />

        <div
          className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm transition-all duration-300 ${
            hovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <ArrowRight
            size={18}
            className={`absolute -rotate-45 transition-all duration-300 ${
              hovered
                ? "translate-x-0 translate-y-0 opacity-100"
                : "translate-x-2 -translate-y-2 opacity-0"
            }`}
          />
          <ArrowRight
            size={18}
            className={`absolute -rotate-45 transition-all duration-300 ${
              hovered
                ? "-translate-x-2 translate-y-2 opacity-0"
                : "translate-x-0 translate-y-0 opacity-100"
            }`}
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      <div className="flex items-start justify-between gap-4 px-1">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-black sm:text-base">
            {title}
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="font-price text-sm font-bold tabular-nums text-black sm:text-[15px]">
              {price}
            </span>
            <span className="font-price text-sm tabular-nums text-black/30 line-through">
              {discount}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <div
            className={`h-8 w-8 overflow-hidden rounded-full border shadow-sm transition-all duration-200 ${
              !hovered ? "border-black" : "border-transparent"
            }`}
          >
            <img src={img1} alt="" className="h-full w-full object-cover" />
          </div>
          <div
            className={`h-8 w-8 overflow-hidden rounded-full border shadow-sm transition-all duration-200 ${
              hovered ? "border-black" : "border-transparent"
            }`}
          >
            <img src={img2} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default SampleProduct;