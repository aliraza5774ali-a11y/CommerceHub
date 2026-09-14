import { Star } from "lucide-react";

const REVIEWS = [
  { name: "Camilla Scianna", date: "December 21, 2025", quote: "She has always taken the time to really understand my needs and my company, while keeping true to the overall agency brand." },
  { name: "Gillian Freeman", date: "December 21, 2025", quote: "Our brand has been strengthened through her creative application. I am very happy and fit with their work. Thanks!" },
  { name: "Peter Ronstadt", date: "December 21, 2025", quote: "We are very pleased with the excellent customer service. Their work is very fast and accurate and really helps my goal of building all!" },
];

export default function Testimonials() {
  return (
    <section className="px-5 py-14 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl items-end justify-between">
        <p className="vibrant-display text-2xl">Client Talk</p>
      </div>
      <div className="mx-auto mt-6 grid max-w-7xl gap-5 sm:grid-cols-3">
        {REVIEWS.map((r) => (
          <div key={r.name} className="rounded-2xl border border-[var(--line)] bg-white p-6">
            <p className="text-sm leading-6 text-[var(--ink-soft)]">"{r.quote}"</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-[var(--sun)]/20" />
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <div className="flex items-center gap-1 text-xs text-[var(--ink-soft)]">
                  <div className="flex text-[var(--sun)]">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={11} fill="currentColor" />)}
                  </div>
                  {r.date}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
