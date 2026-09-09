import { ArrowRight, Layers } from "lucide-react";
import SectionHeader from "../SectionHeader";
import { Link } from "react-router-dom";

const COLLECTIONS = [
  {
    label: "AW 2025",
    name: "Arctic Minimal",
    desc: "Clean cuts and muted tones inspired by the stillness of winter landscapes.",
    image: "https://framerusercontent.com/images/g813yVl0fq2gEobS7kOZx537SY.jpg",
    tag: "New Season",
  },
  {
    label: "SS 2025",
    name: "Urban Warmth",
    desc: "Relaxed silhouettes built for the city — soft fabrics, sharp details.",
    image: "https://framerusercontent.com/images/Or4CSjqekPU2Ug6V0zSDTbgtg.jpg",
    tag: "Bestseller",
  },
  {
    label: "Resort 2025",
    name: "Quiet Luxury",
    desc: "Premium essentials that carry you from morning light to evening ease.",
    image: "https://framerusercontent.com/images/YI6OX1Ix0QFPJHufS272fscYaI.jpg",
    tag: "Limited",
  },
];

const CollectionCard = () => {
  return (
    <section className="bg-[#f8f8f8] px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-12 lg:py-14 xl:px-20 xl:py-16 2xl:px-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:gap-8 md:gap-10">
        <SectionHeader
          badge="Current Collections"
          icon={<Layers size={13} />}
          heading={
            <>
              Curated drops, <br className="hidden sm:block" /> built to last
            </>
          }
          ctaLabel="View all"
          ctaLink="/collections"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-5 xl:gap-6">
          {COLLECTIONS.map((col, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4]"
            >
              <img
                src={col.image}
                alt={col.name}
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm sm:left-4 sm:top-4">
                {col.tag}
              </span>

              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 sm:p-5 md:p-6">
                <span className="font-mono text-[10px] tracking-widest text-white/50 uppercase sm:text-xs">
                  {col.label}
                </span>

                <h4 className="font-display text-xl font-medium tracking-tight text-white sm:text-2xl lg:text-[1.65rem]">
                  {col.name}
                </h4>

                <p className="text-xs leading-relaxed text-white/65 sm:text-sm">
                  {col.desc}
                </p>

                <Link to='/collections'>
                <button className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-black transition hover:bg-white/90 sm:mt-3">
                  Explore <ArrowRight size={12} />
                </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionCard;