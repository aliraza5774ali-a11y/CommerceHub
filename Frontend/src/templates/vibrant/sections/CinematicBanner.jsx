import { Play } from "lucide-react";

export default function CinematicBanner() {
  return (
    <section className="px-5 py-10 sm:px-10 lg:px-16">
      <div className="relative mx-auto aspect-[16/9] max-w-7xl overflow-hidden rounded-3xl sm:aspect-[21/9]">
        <img
          src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1600&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <button
          aria-label="Play video"
          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--sun)] shadow-lg"
        >
          <Play size={22} fill="currentColor" />
        </button>
        <h2 className="vibrant-display absolute bottom-8 left-6 text-4xl text-white sm:text-6xl">
          True Magnificence
        </h2>
      </div>
    </section>
  );
}
