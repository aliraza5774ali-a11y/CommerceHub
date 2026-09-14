import { Link } from "react-router-dom";

const MOODS = [
  { title: "Weekend look", caption: "Zero plans, maximum main-character energy.", image: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?auto=format&fit=crop&w=800&q=80", cta: true },
  { title: "Office, but easy", caption: "Meetings at ten. Drinks at six.", image: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?auto=format&fit=crop&w=600&q=80" },
  { title: "Casual hangout", caption: "Show up as the best-dressed friend.", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80" },
];

export default function StyleMoods() {
  return (
    <section className="px-5 py-16 sm:px-10 lg:px-16">
      <p className="text-xs uppercase tracking-[.2em] text-[var(--ink-soft)]">Style It Your Way / 03</p>
      <h2 className="texart-display mt-2 text-4xl sm:text-5xl">
        One check.<br /><em>Three moods.</em>
      </h2>
      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl sm:row-span-1">
          <img src={MOODS[0].image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          {MOODS[0].cta && (
            <Link to="/shops" className="texart-btn absolute right-4 top-4 bg-white !py-2 text-xs">Shop look →</Link>
          )}
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-lg font-semibold">{MOODS[0].title}</p>
            <p className="text-xs text-white/80">{MOODS[0].caption}</p>
          </div>
        </div>
        <div className="grid gap-5">
          {MOODS.slice(1).map((m) => (
            <div key={m.title} className="group relative aspect-[16/10] overflow-hidden rounded-2xl">
              <img src={m.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-base font-semibold">{m.title}</p>
                <p className="text-xs text-white/80">{m.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
