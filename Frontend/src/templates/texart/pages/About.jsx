import { getTexartHero } from "../data/heroContent";
import PageHero from "../components/PageHero";

export default function TexartAbout() {
  const hero = getTexartHero("about");

  return (
    <>
      <PageHero content={hero} />
      <section className="grid gap-10 px-5 py-16 sm:grid-cols-2 sm:px-10 lg:px-16">
        <img src={hero.image} alt="" className="h-80 w-full rounded-2xl object-cover sm:h-full" />
        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[.2em] text-[var(--ink-soft)]">Our story</p>
          <h2 className="texart-display mt-4 text-4xl leading-tight">
            Checks with a <em>point of view</em>.
          </h2>
          <p className="mt-6 max-w-md leading-7 text-[var(--ink-soft)]">
            {hero.subtext} We start with the pattern, not the trend cycle — colours and cuts made to be worn for years, not one season.
          </p>
        </div>
      </section>
      <section className="bg-[var(--violet)] px-5 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          {[["01", "Fabric first"], ["02", "Small batches"], ["03", "Built to last"]].map(([n, title]) => (
            <div key={n} className="rounded-2xl bg-white p-6">
              <p className="text-xs text-[var(--ink-soft)]">{n}</p>
              <h3 className="texart-display mt-3 text-xl">{title}</h3>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
