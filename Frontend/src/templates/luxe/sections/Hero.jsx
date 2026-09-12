import { Link } from "react-router-dom";

export default function Hero({ content }) {
  return (
    <section className="px-5 pb-10 pt-8 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs uppercase tracking-[.2em] text-[var(--ink-soft)]">{content.badgeText}</p>
          <h1 className="luxe-display mt-4 text-5xl leading-[1.05] sm:text-6xl">{content.heading}</h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-[var(--ink-soft)]">{content.subtext}</p>
          <div className="mt-8 flex items-center gap-6">
            <Link to={content.primaryLink} className="luxe-btn luxe-btn-solid">{content.primaryLabel}</Link>
            <Link to={content.secondaryLink} className="text-sm underline underline-offset-4">{content.secondaryLabel}</Link>
          </div>
        </div>
        <div className="aspect-[4/3] overflow-hidden rounded-sm sm:aspect-[6/5]">
          <img src={content.image} alt="" className="h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}
