import HomeMotion from "@/components/animations/HomeMotion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import MapSection from "@/components/MapSection";
import DashboardSection from "@/components/DashboardSection";
import FeaturesSection from "@/components/FeaturesSection";
import ImpactSection from "@/components/ImpactSection";
import FutureVision from "@/components/FutureVision";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <HomeMotion />
      <Navbar />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <MapSection />
      <DashboardSection />
      <FeaturesSection />
      <ImpactSection />
      <FutureVision />
      <Footer />
    </main>
  );
}
