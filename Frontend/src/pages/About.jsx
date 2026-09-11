import hero1 from "../assets/aboutImage.avif";
import AboutSection from "../components/sections/AboutSection";
import HeroSection from "../components/sections/HeroSection";
import PartnersSection from "../components/sections/PartnerSection";
import { useCmsHero } from "../utils/useCmsHero";

const About = () => {
  const hero = useCmsHero("about");
  return (
    <div>
  <HeroSection
  mode="about"
  image={hero.image || hero1}
  badge={{ label: hero.badgeLabel, text: hero.badgeText }}
  heading={hero.heading}
  subtext={hero.subtext}
/>
      <PartnersSection/>
      <AboutSection/>
    </div>
  );
};

export default About;
