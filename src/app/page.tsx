import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { VolunteerSection } from "@/components/landing/volunteer-section";
import { StoriesSection } from "@/components/landing/stories";
import { Footer } from "@/components/landing/footer";

// import { HowItWorks } from "@/components/landing/how-it-works";
// import { Testimonials } from "@/components/landing/testimonials";

import { TopNav } from "@/components/navigation/top-nav";
import HeroLayout from "../components/general/hero-layout";
import OrphanageBanner from "@/components/landing/orphanage-banner";

export default function Home() {
  return (
    <>
      <HeroLayout bgImage="https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWZyaWNhbiUyMGtpZHN8ZW58MHx8MHx8fDA%3D">
        <TopNav />
        <HeroSection />
      </HeroLayout>

      <FeaturesSection />

      <StoriesSection />

      <VolunteerSection />

      <div className="px-5 pb-20 lg:px-32 2xl:px-54">
        <OrphanageBanner />
      </div>
      {/* <HowItWorks /> */}
      {/* <Testimonials /> */}
      <Footer />
    </>
  );
}
