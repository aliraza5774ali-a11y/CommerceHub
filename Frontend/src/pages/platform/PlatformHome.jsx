import PlatformNavbar from "../../components/platform/PlatformNavbar";
import PlatformHero from "../../components/platform/PlatformHero";
import TrustSection from "../../components/platform/TrustSection";
import LiveShowcaseMarquee from "../../components/platform/LiveShowcaseMarquee";
import PlatformOverview from "../../components/platform/PlatformOverview";
import HowItWorks from "../../components/platform/HowItWorks";
import StorefrontShowcase from "../../components/platform/StorefrontShowcase";
import FeatureGrid from "../../components/platform/FeatureGrid";
import BusinessManagementShowcase from "../../components/platform/BusinessManagementShowcase";
import PricingSection from "../../components/platform/PricingSection";
import TestimonialsSection from "../../components/platform/TestimonialsSection";
import FAQSection from "../../components/platform/FAQSection";
import CTASection from "../../components/platform/CTASection";
import PlatformFooter from "../../components/platform/PlatformFooter";

const PlatformHome = () => {
  return (
    <div className="bg-[#fafaf9] text-black">
      <PlatformNavbar />
      <main>
        <PlatformHero />
        <TrustSection />
        <LiveShowcaseMarquee />
        <PlatformOverview />
        <HowItWorks />
        <StorefrontShowcase />
        <FeatureGrid />
        <BusinessManagementShowcase />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <PlatformFooter />
    </div>
  );
};

export default PlatformHome;