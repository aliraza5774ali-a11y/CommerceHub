import { Link } from "react-router-dom";

export default function Hero({ content }) {
  return (
    <section className="bg-[var(--lime)]">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 pb-10 pt-10 sm:px-10 lg:grid-cols-2 lg:px-16">
        <div>
          <p className="text-xs uppercase tracking-[.2em] text-[var(--ink-soft)]">{content.badgeText}</p>
          <h1 className="texart-display mt-4 text-5xl leading-[1.05] sm:text-6xl">
            {content.headingPre} <em>{content.headingEm}</em><br />{content.headingPost}
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-[var(--ink-soft)]">{content.subtext}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to={content.primaryLink} className="texart-btn texart-btn-solid">{content.primaryLabel} →</Link>
            <Link to={content.secondaryLink} className="texart-btn texart-btn-outline">{content.secondaryLabel}</Link>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl">
            <img src={content.image} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="texart-display absolute -left-6 top-6 flex h-24 w-24 -rotate-12 items-center justify-center rounded-full bg-white text-center text-[10px] font-bold uppercase leading-tight shadow-lg">
            Fashion<br />Shirts<br />2026
          </div>
        </div>
      </div>
      <div className="texart-scrollbar overflow-x-hidden border-y border-[var(--ink)]/15 py-3">
        <p className="whitespace-nowrap text-xs uppercase tracking-[.2em] text-[var(--ink-soft)]">
          {"Made check smart  ·  Made for right now  ·  Not your average check shirt  ·  Made to last  ·  ".repeat(3)}
        </p>
      </div>
    </section>
  );
}
