import HeroSection from "../components/sections/HeroSection";
import { ArrowRight } from "lucide-react";
import hero01 from "../assets/collectionHero.jpg";
import CollectionStory from "../components/sections/CollectionStory";
import CollectionCard from "../components/sections/CollectionCard";
import ProductSection from "../components/sections/ProductSection";
import { useNavigate } from "react-router-dom";

const Collection = () => {
  const navigate = useNavigate()
  return (
    <div className="bg-[#f8f8f8]">
      <HeroSection
  mode="collection"
  image={hero01}
  heading="The Essentials"
  subtext="Minimal pieces for maximum impact"
  primaryLabel="View All"
/>

      <CollectionStory />
      <CollectionCard />

      <section className="bg-[#f8f8f8] px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-12 lg:py-14 xl:px-20 xl:py-16 2xl:px-28">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/7]">
          <img
            src="https://framerusercontent.com/images/HaLbFMQL3UBYnLDE5V1KjUjLbU.jpg"
            alt="Featured Look"
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent" />

          <div className="absolute inset-0 flex items-end sm:items-center">
            <div className="max-w-xl px-4 py-5 sm:px-8 sm:py-8 md:px-12 lg:px-16">
              <span className="font-mono text-[10px] tracking-widest text-white/50 uppercase sm:text-xs">
                Featured Look
              </span>

              <h3 className="mt-2 font-display text-2xl font-medium leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                The Signature
                <br />
                Winter Edit
              </h3>

              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65 sm:text-base">
                Our most refined pieces brought together — layered, minimal, and
                built to move with you.
              </p>

              <button onClick={() =>navigate('/shops')} className="cursor-pointer mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 sm:mt-6 sm:px-6">
                Shop the Look <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <ProductSection />
    </div>
  );
};

export default Collection;