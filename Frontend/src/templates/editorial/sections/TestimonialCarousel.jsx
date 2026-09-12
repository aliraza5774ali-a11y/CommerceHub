import { Star } from "lucide-react";

const reviews = [
  { quote: "Beautifully made, and even better in person.", name: "Jane Cooper" },
  { quote: "A quieter way to get dressed—every morning feels calmer.", name: "Darlene Robertson" },
  { quote: "Fast delivery and the kitchen finally feels much greener.", name: "Jacob Jones" },
  { quote: "The pieces I reach for without thinking anymore.", name: "Esther Howard" },
];

export default function TestimonialCarousel() {
  return (
    <section className="bg-[var(--forest)] px-5 py-16 text-[var(--paper)] sm:px-10 lg:px-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[.2em] text-[var(--gold)]">Notes from our community</p>
          <h2 className="editorial-display mt-2 text-3xl sm:text-4xl">Loved by our customers</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="editorial-display text-3xl">4.9</span>
          <div>
            <div className="flex gap-0.5 text-[var(--gold)]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-[var(--paper)]/60">from 25,000+ reviews</p>
          </div>
        </div>
      </div>

      <div className="editorial-scrollbar flex gap-5 overflow-x-auto pb-4">
        {reviews.map((r) => (
          <blockquote
            key={r.name}
            className="w-72 shrink-0 rounded-xl bg-[var(--paper)]/5 p-6"
          >
            <div className="flex gap-0.5 text-[var(--gold)]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} fill="currentColor" />
              ))}
            </div>
            <p className="editorial-display mt-4 text-lg leading-snug">“{r.quote}”</p>
            <footer className="mt-5 text-xs uppercase tracking-[.14em] text-[var(--paper)]/60">
              {r.name}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
