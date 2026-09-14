import { Link } from "react-router-dom";

export default function Hero({ content }) {
  return (
    <section className="px-5 pt-6 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl bg-[var(--sun)] lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-12 text-white sm:px-12">
          <h1 className="vibrant-display text-5xl leading-[1.05] sm:text-6xl">
            {content.heading.split(" ").slice(0, -1).join(" ")}<br />{content.heading.split(" ").slice(-1)}
          </h1>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              {["A", "B", "C"].map((l) => (
                <span key={l} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--sun)] bg-white text-[10px] font-bold text-[var(--sun)]">{l}</span>
              ))}
            </div>
            <p className="text-xs">{content.rating} ({content.reviewCount} rating)</p>
          </div>
          <p className="mt-6 max-w-xs text-sm leading-6 text-white/85">{content.subtext}</p>
          <Link to={content.primaryLink} className="vibrant-btn vibrant-btn-light mt-8 w-fit">{content.primaryLabel}</Link>
        </div>
        <div className="relative min-h-[320px]">
          <img src={content.image} alt="" className="h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}
