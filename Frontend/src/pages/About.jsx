import hero1 from "../assets/aboutImage.avif";
import AboutSection from "../components/sections/AboutSection";
import HeroSection from "../components/sections/HeroSection";
import PartnersSection from "../components/sections/PartnerSection";

const About = () => {
  return (
    <div>
  <HeroSection
  mode="about"
  image={hero1}
  badge={{ label: "About Us", text: "Crafting Experiences" }}
  heading="Designing Products"
  subtext="We believe great products are built through thoughtful design, quality craftsmanship, and attention to every detail."
/>
      <PartnersSection/>
      <AboutSection/>
    </div>
  );
};

export default About;
