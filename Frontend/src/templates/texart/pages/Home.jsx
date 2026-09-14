import Hero from "../sections/Hero";
import Favourites from "../sections/Favourites";
import FlexFeature from "../sections/FlexFeature";
import StyleMoods from "../sections/StyleMoods";
import SoftFeel from "../sections/SoftFeel";
import Testimonials from "../sections/Testimonials";
import ProcessSteps from "../sections/ProcessSteps";
import LimitedBanner from "../sections/LimitedBanner";
import { getTexartHero } from "../data/heroContent";

export default function TexartHomePage() {
  const hero = getTexartHero("home");

  return (
    <>
      <Hero content={hero} />
      <Favourites />
      <FlexFeature />
      <StyleMoods />
      <SoftFeel />
      <Testimonials />
      <ProcessSteps />
      <LimitedBanner />
    </>
  );
}
