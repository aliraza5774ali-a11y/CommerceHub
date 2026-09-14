import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function useCountdown(hours = 50) {
  const [remaining, setRemaining] = useState(hours * 3600);
  useEffect(() => {
    const id = setInterval(() => setRemaining((r) => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const d = Math.floor(remaining / 86400);
  const h = Math.floor((remaining % 86400) / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  return [d, h, m, s].map((n) => String(n).padStart(2, "0"));
}

export default function LimitedBanner() {
  const [d, h, m, s] = useCountdown(2 * 24 + 14);

  return (
    <section className="px-5 py-16 sm:px-10 lg:px-16">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-[var(--lime-deep)] px-8 py-16 text-[var(--ink)] sm:px-16">
        <p className="text-xs uppercase tracking-[.2em]">Small batch / No repeats</p>
        <h2 className="texart-display mt-3 text-4xl leading-tight sm:text-5xl">
          Limited check<br /><em>collection 02</em>.
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--ink)]/70">
          The colours everyone will ask about. Available until they are not.
        </p>
        <div className="mt-7 flex gap-3 text-sm">
          {[["Days", d], ["Hrs", h], ["Min", m], ["Sec", s]].map(([label, val]) => (
            <div key={label} className="rounded-lg bg-white/60 px-3 py-2 text-center">
              <p className="texart-display text-xl">{val}</p>
              <p className="text-[10px] uppercase tracking-[.1em]">{label}</p>
            </div>
          ))}
        </div>
        <Link to="/shops" className="texart-btn texart-btn-solid mt-8 w-fit">
          Shop before it's gone <ArrowRight size={14} />
        </Link>

        <div className="texart-display absolute -right-4 top-6 flex h-24 w-24 rotate-12 items-center justify-center rounded-full bg-white text-center text-[10px] font-bold uppercase leading-tight shadow-lg sm:right-10">
          Fashion<br />Shirts<br />2026
        </div>
      </div>
    </section>
  );
}
