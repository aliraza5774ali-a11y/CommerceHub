import { useEffect, useState } from "react";
import BestSeller from "../components/sections/BestSeller";
import BlogSection from "../components/sections/BlogSection";
import CollectionSection from "../components/sections/CollectionSection";
import HeroSection from "../components/sections/HeroSection";
import ProductSection from "../components/sections/ProductSection";
import ReviewSection from "../components/sections/ReviewSection";
import StyleWearSection from "../components/sections/StyleWearSection";
import VideoSection from "../components/sections/VideoSection";
import { api } from "../api/commerceApi";
import {
  HOMEPAGE_SLUG,
  DEFAULT_HERO_CONTENT,
} from "../config/homepageSections";

import img1 from "../assets/hero_01.avif";

// Components rendered for a homepage CMS section, keyed by sectionType.
// `hero` reads its content from CMS; the rest are fixed layouts that are
// simply shown/hidden and reordered by the admin.
const SECTION_COMPONENTS = {
  hero: null, // handled separately — it needs `content` passed in as props
  products: ProductSection,
  best_sellers: BestSeller,
  collection: CollectionSection,
  testimonials: ReviewSection,
  style_and_wear: StyleWearSection,
  blog: BlogSection,
};

const DEFAULT_SECTIONS = [
  { sectionType: "hero", enabled: true, content: DEFAULT_HERO_CONTENT },
  { sectionType: "products", enabled: true, content: {} },
  { sectionType: "best_sellers", enabled: true, content: {} },
  { sectionType: "collection", enabled: true, content: {} },
  { sectionType: "testimonials", enabled: true, content: {} },
  { sectionType: "style_and_wear", enabled: true, content: {} },
  { sectionType: "blog", enabled: true, content: {} },
];

const Home = () => {
  const [sections, setSections] = useState(DEFAULT_SECTIONS);

  useEffect(() => {
    let active = true;
    api
      .storefrontPage(HOMEPAGE_SLUG)
      .then((page) => {
        if (!active) return;
        const published = (page?.sections || []).filter((s) => s.enabled !== false);
        // Only take over rendering once the admin has actually published a
        // homepage with at least one section — otherwise keep the defaults
        // so a brand-new store never shows a blank page.
        if (published.length) setSections(published);
      })
      .catch(() => {
        // No published homepage yet (or request failed) — defaults stay.
      });
    return () => {
      active = false;
    };
  }, []);

  const heroSection = sections.find((s) => s.sectionType === "hero");
  const hero = { ...DEFAULT_HERO_CONTENT, ...(heroSection?.content || {}) };

  return (
    <>
      <HeroSection
        mode="hero"
        image={hero.image || img1}
        badge={{ label: hero.badgeLabel, text: hero.badgeText }}
        heading={hero.heading}
        subtext={hero.subtext}
        primaryLabel={hero.primaryLabel}
        primaryLink={hero.primaryLink}
        secondaryLabel={hero.secondaryLabel}
        secondaryLink={hero.secondaryLink}
      />

      <VideoSection />

      {sections
        .filter((s) => s.sectionType !== "hero" && SECTION_COMPONENTS[s.sectionType])
        .map((section, index) => {
          const Component = SECTION_COMPONENTS[section.sectionType];
          return <Component key={section.id ?? `${section.sectionType}-${index}`} />;
        })}
    </>
  );
};

export default Home;
