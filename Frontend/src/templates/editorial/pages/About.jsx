import { getDummyHero } from "../data/heroContent";
import PageHero from "../components/PageHero";
import { editorialImages } from "../placeholderImages";

export default function EditorialAbout() {
  const hero = getDummyHero("about");

  return (
    <>
      <PageHero content={hero} eyebrow="Our story" />
      <section className="grid gap-10 px-5 py-16 sm:grid-cols-2 sm:px-10 lg:px-16">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[.2em] text-[var(--coral)]">Made with intention</p>
          <h2 className="editorial-display mt-4 text-5xl leading-tight">Thoughtful objects for a life well lived.</h2>
          <p className="mt-7 leading-8 text-[var(--forest)]/75">{hero.subtext}</p>
          <p className="mt-5 leading-8 text-[var(--forest)]/75">
            We believe the things we bring home should earn their place: through material, utility, and a little everyday beauty.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src={hero.image || editorialImages.storyCollageA} alt="Our studio" className="col-span-2 h-80 w-full object-cover" />
          <img src={editorialImages.storyCollageB} alt="" className="h-48 w-full object-cover" />
          <img src={editorialImages.storyCollageC} alt="" className="h-48 w-full object-cover" />
        </div>
      </section>
      <section className="bg-[var(--forest)] px-5 py-16 text-[var(--paper)] sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
          {[["01", "Material first"], ["02", "Made to last"], ["03", "Less, better"]].map(([n, title]) => (
            <div key={n} className="border-t border-[var(--paper)]/30 pt-4">
              <p className="text-xs text-[var(--gold)]">{n}</p>
              <h3 className="editorial-display mt-4 text-3xl">{title}</h3>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
