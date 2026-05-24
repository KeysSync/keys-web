import LandingCTA from "@/app/components/Landing/LandingCTA";
import LandingClients from "@/app/components/Landing/LandingClients";
import LandingFAQ from "@/app/components/Landing/LandingFAQ";
import LandingFeatures from "@/app/components/Landing/LandingFeatures";
import LandingFooter from "@/app/components/Landing/LandingFooter";
import LandingHero from "@/app/components/Landing/LandingHero";
import LandingHowItWorks from "@/app/components/Landing/LandingHowItWorks";
import LandingNav from "@/app/components/Landing/LandingNav";
import LandingPricing from "@/app/components/Landing/LandingPricing";
import LandingShowcase from "@/app/components/Landing/LandingShowcase";
import LandingTestimonials from "@/app/components/Landing/LandingTestimonials";
import type { Metadata } from "next";
import "./page.css";

export const metadata: Metadata = {
  title: "Keys · Sistema para administradoras de imóveis",
  description:
    "O sistema completo para administradoras de imóveis: contratos, cobrança, repasses, relatórios e dashboards. Substitua planilhas por um fluxo único, rápido e moderno.",
  openGraph: {
    title: "Keys · Sistema para administradoras de imóveis",
    description:
      "Contratos, cobrança, repasses e relatórios em uma plataforma moderna pensada para imobiliárias brasileiras.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function LandingPage() {
  return (
    <div className="landing-root">
      <LandingNav />
      <main className="landing-main">
        <LandingHero />
        <LandingClients />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingShowcase />
        <LandingTestimonials />
        <LandingPricing />
        <LandingFAQ />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
