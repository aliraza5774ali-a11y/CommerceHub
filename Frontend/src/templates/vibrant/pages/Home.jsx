import Hero from "../sections/Hero";
import FeatureBar from "../sections/FeatureBar";
import CategoryBento from "../sections/CategoryBento";
import CollectionGrid from "../sections/CollectionGrid";
import FeaturedBanner from "../sections/FeaturedBanner";
import BestSellingSplit from "../sections/BestSellingSplit";
import CinematicBanner from "../sections/CinematicBanner";
import Testimonials from "../sections/Testimonials";
import PromoStrip from "../sections/PromoStrip";
import NewsletterStrip from "../sections/NewsletterStrip";
import { getVibrantHero } from "../data/heroContent";

export default function VibrantHomePage() {
  const hero = getVibrantHero("home");

  return (
    <>
      <Hero content={hero} />
      <FeatureBar />
      <CategoryBento />
      <CollectionGrid />
      <FeaturedBanner />
      <BestSellingSplit />
      <CinematicBanner />
      <Testimonials />
      <PromoStrip />
      <NewsletterStrip />
    </>
  );
}
