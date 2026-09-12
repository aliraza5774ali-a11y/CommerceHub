import { getDummyHero } from "../data/heroContent";
import { editorialImages } from "../placeholderImages";

// Story/gallery section: a large lead image paired with local dummy "about"
// copy, plus a strip of supporting tiles below.
export default function StoryCollage() {
  const story = getDummyHero("about");
  const tiles = [editorialImages.storyCollageB, editorialImages.storyCollageC, editorialImages.newsletterTileC];

  return (
    <section className="bg-[var(--paper-dim)] px-5 py-16 sm:px-10 lg:px-16">
      <div className="grid gap-10 sm:grid-cols-2 sm:items-center">
        <div className="order-2 sm:order-1">
          <p className="text-xs uppercase tracking-[.2em] text-[var(--coral)]">Our point of view</p>
          <h2 className="editorial-display mt-4 text-3xl leading-tight sm:text-4xl">{story.heading}</h2>
          <p className="mt-5 max-w-md leading-7 text-[var(--forest)]/75">{story.subtext}</p>
        </div>
        <div className="order-1 aspect-[5/4] overflow-hidden rounded-2xl sm:order-2">
          <img src={story.image || editorialImages.storyCollageA} alt="" className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="editorial-scrollbar mt-10 flex gap-4 overflow-x-auto pb-2">
        {tiles.map((src) => (
          <div key={src} className="h-40 w-56 shrink-0 overflow-hidden rounded-xl">
            <img src={src} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
