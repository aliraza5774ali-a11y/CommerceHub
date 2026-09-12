import Hero from "../sections/Hero";
import CategoryStrip from "../sections/CategoryStrip";
import ThisWeeksEdit from "../sections/ThisWeeksEdit";
import PromoBanner from "../sections/PromoBanner";
import BestSellers from "../sections/BestSellers";
import NewsletterMembers from "../sections/NewsletterMembers";
import { getLuxeHero } from "../data/heroContent";

export default function LuxeHomePage() {
  const hero = getLuxeHero("home");

  return (
    <>
      <Hero content={hero} />
      <CategoryStrip />
      <ThisWeeksEdit />
      <PromoBanner />
      <BestSellers />
      <NewsletterMembers />
    </>
  );
}
