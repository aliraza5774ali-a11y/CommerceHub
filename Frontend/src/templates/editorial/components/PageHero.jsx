import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { editorialImages } from "../placeholderImages";

// Split hero: eyebrow/heading/copy/CTA on the left, a framed lifestyle image
// on the right with a small floating "eco" badge — mirrors the reference
// layout with dummy content passed in via props (see ../data/heroContent.js).
export default function PageHero({ content, eyebrow = "The journal" }) {
  return (
    <section className="bg-[var(--forest)] px-5 pb-14 pt-32 text-[var(--paper)] sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="editorial-badge bg-[var(--paper)]/10 text-[var(--paper)]/80">
            {content.badgeText || eyebrow}
          </p>
          <h1 className="editorial-display mt-5 max-w-xl text-4xl leading-[1.05] sm:text-6xl">
            {content.heading}
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-[var(--paper)]/75">
            {content.subtext}
          </p>
          {content.primaryLabel && content.primaryLink && (
            <Link
              to={content.primaryLink}
              className="editorial-pill editorial-pill-gold mt-8"
            >
              {content.primaryLabel}
            </Link>
          )}
        </div>

        <div className="relative">
          <div className="aspect-[6/5] overflow-hidden rounded-2xl">
            <img
              src={content.image || editorialImages.pageFallback}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-xl bg-[var(--forest-dark)] px-5 py-4 shadow-lg sm:-left-8">
            <Leaf size={20} className="text-[var(--gold)]" />
            <div>
              <p className="text-[.65rem] uppercase tracking-[.14em] text-[var(--paper)]/60">
                Natural · Sustainable
              </p>
              <p className="editorial-display text-lg leading-none">Eco-conscious</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
