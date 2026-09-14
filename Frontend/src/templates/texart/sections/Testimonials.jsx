import { Star, Quote } from "lucide-react";

const REVIEWS = [
  { name: "Rifat A.", source: "Instagram", quote: "I bought one for an event and now I have four. The fit is unreal — relaxed but still sharp." },
  { name: "Nafisa R.", source: "Google", quote: "Finally a check shirt that does not make me feel like I am borrowing from my dad's closet." },
  { name: "Arman H.", source: "TikTok", quote: "The fabric feels expensive and the colours are even better in person. Fully obsessed." },
];

export default function Testimonials() {
  return (
    <section className="bg-[var(--violet)] px-5 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[.2em] text-[var(--ink-soft)]">Worn & Loved / 05</p>
          <h2 className="texart-display mt-2 text-4xl">
            Good words from<br /><em>good people</em>.
          </h2>
        </div>
        <div className="text-right">
          <p className="texart-display text-4xl">4.9</p>
          <div className="mt-1 flex justify-end gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} className="fill-current" />)}
          </div>
          <p className="text-xs text-[var(--ink-soft)]">from 500+ verified reviews</p>
        </div>
      </div>
      <div className="mx-auto mt-10 grid max-w-6xl gap-5 sm:grid-cols-3">
        {REVIEWS.map((r) => (
          <div key={r.name} className="rounded-2xl bg-white p-6">
            <Quote size={22} className="text-[var(--lime-deep)]" />
            <p className="mt-4 text-sm leading-6">{r.quote}</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[var(--lime)]" />
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-xs text-[var(--ink-soft)]">{r.source}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
