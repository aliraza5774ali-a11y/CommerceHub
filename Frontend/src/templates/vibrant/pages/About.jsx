import { getVibrantHero } from "../data/heroContent";
import PageHero from "../components/PageHero";

export default function VibrantAbout() {
  const hero = getVibrantHero("about");

  return (
    <>
      <PageHero content={hero} />
      <section className="grid gap-10 px-5 py-16 sm:grid-cols-2 sm:px-10 lg:px-16">
        <img src={hero.image} alt="" className="h-80 w-full rounded-2xl object-cover sm:h-full" />
        <div className="flex flex-col justify-center">
          <p className="vibrant-badge w-fit bg-[var(--sun)]/10 text-[var(--sun)]">Our story</p>
          <h2 className="vibrant-display mt-4 text-4xl leading-tight">Bold style, made accessible.</h2>
          <p className="mt-6 max-w-md leading-7 text-[var(--ink-soft)]">
            {hero.subtext} We keep quality high and prices fair, so looking good is never out of reach.
          </p>
        </div>
      </section>
      <section className="bg-white px-5 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          {[["01", "Quality first"], ["02", "Fair pricing"], ["03", "Fast support"]].map(([n, title]) => (
            <div key={n} className="rounded-2xl bg-[var(--cream)] p-6">
              <p className="text-xs text-[var(--sun)]">{n}</p>
              <h3 className="vibrant-display mt-3 text-xl">{title}</h3>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
