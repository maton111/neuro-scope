import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { MockDashboardPreview } from "@/components/landing/MockDashboardPreview";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CtaSection } from "@/components/landing/CtaSection";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <MockDashboardPreview />
      <div id="features">
        <FeatureCards />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <CtaSection />
      <footer className="border-t border-white/6 px-6 py-8 text-center font-mono text-xs text-muted-foreground">
        NeuroScope · Built by Mattia Archina · MIT License
      </footer>
    </div>
  );
}