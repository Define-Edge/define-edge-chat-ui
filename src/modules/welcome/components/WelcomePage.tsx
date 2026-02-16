"use client";

import WelcomeNavbar from "./shared/WelcomeNavbar";
import WelcomeFooter from "./shared/WelcomeFooter";
import HeroSection from "./sections/HeroSection";
import FeaturesGrid from "./sections/FeaturesGrid";
import FeatureShowcase from "./sections/FeatureShowcase";
import SecuritySection from "./sections/SecuritySection";
import CTASection from "./sections/CTASection";

export default function WelcomePage() {
  return (
    <div className="min-h-dvh bg-white">
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>

      <WelcomeNavbar />

      <main id="main-content">
        <HeroSection />
        <FeaturesGrid />
        <FeatureShowcase />
        <SecuritySection />
        <CTASection />
      </main>

      <WelcomeFooter />
    </div>
  );
}
