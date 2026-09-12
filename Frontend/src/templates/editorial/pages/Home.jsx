import EditorialHero from "../sections/EditorialHero";
import GalleryProducts from "../sections/GalleryProducts";
import NewArrivalFeature from "../sections/NewArrivalFeature";
import StoryCollage from "../sections/StoryCollage";
import TestimonialCarousel from "../sections/TestimonialCarousel";
import NewsletterBanner from "../sections/NewsletterBanner";
import { getDummyHero } from "../data/heroContent";

// Fully standalone homepage — hero copy and product data below are all
// local dummy content (see ../data), independent of the shared CMS/API.
export default function EditorialHomePage() {
  const hero = getDummyHero("home");

  return (
    <>
      <EditorialHero content={hero} />
      <GalleryProducts />
      <NewArrivalFeature />
      <StoryCollage />
      <TestimonialCarousel />
      <NewsletterBanner />
    </>
  );
}
