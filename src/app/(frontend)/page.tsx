import { Hero } from "@/components/frontend/home/hero";
import { CompanyIntroAndWhyChooseUs } from "@/components/frontend/home/company-intro";
import { FeaturedProducts } from "@/components/frontend/home/featured-products";
import { IndustriesServed } from "@/components/frontend/home/industries-served";
import { GlobalPresence } from "@/components/frontend/home/global-presence";
import { CertificatesSection } from "@/components/frontend/home/certificates-section";
import { ManufacturingCapabilitiesSection } from "@/components/frontend/home/manufacturing-capabilities";
import { LatestNews } from "@/components/frontend/home/latest-news";
import { TestimonialsSection } from "@/components/frontend/home/testimonials";
import { PartnerLogos } from "@/components/frontend/home/partner-logos";
import { ContactCta } from "@/components/frontend/home/contact-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CompanyIntroAndWhyChooseUs />
      <FeaturedProducts />
      <IndustriesServed />
      <GlobalPresence />
      <CertificatesSection />
      <ManufacturingCapabilitiesSection />
      <TestimonialsSection />
      <LatestNews />
      <PartnerLogos />
      <ContactCta />
    </>
  );
}
