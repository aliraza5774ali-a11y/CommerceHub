import { getLuxeHero } from "../data/heroContent";
import PageHero from "../components/PageHero";

export default function LuxeAbout() {
  const hero = getLuxeHero("about");

  return (
    <>
      <PageHero content={hero} />
      <section className="grid gap-10 px-5 py-16 sm:grid-cols-2 sm:px-10 lg:px-16">
        <img src={hero.image} alt="" className="h-80 w-full object-cover sm:h-full" />
        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[.2em] text-[var(--ink-soft)]">Made with intention</p>
          <h2 className="luxe-display mt-4 text-4xl leading-tight">Fewer pieces, made better.</h2>
          <p className="mt-6 max-w-md leading-7 text-[var(--ink-soft)]">
            {hero.subtext} Every collection starts with fabric, not sketches — we choose the material first and let the form follow.
          </p>
        </div>
      </section>
      <section className="border-t border-[var(--line)] bg-[var(--sand)] px-5 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
          {[["01", "Fabric first"], ["02", "Small runs"], ["03", "Built to last"]].map(([n, title]) => (
            <div key={n} className="border-t border-[var(--ink)]/20 pt-4">
              <p className="text-xs text-[var(--ink-soft)]">{n}</p>
              <h3 className="luxe-display mt-4 text-2xl">{title}</h3>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
