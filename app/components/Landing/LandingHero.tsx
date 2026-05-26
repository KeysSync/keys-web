import { ArrowRight, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import DashboardMockup from "./DashboardMockup";

const stats = [
  { value: "+2.4 mil", label: "imóveis sob gestão" },
  { value: "98,7%", label: "taxa de repasses no prazo" },
  { value: "R$ 1,2bi", label: "processados no último ano" },
];

export default function LandingHero() {
  return (
    <section className="landing-hero">
      <div className="landing-hero__bg" aria-hidden />

      <div className="landing-hero__inner">
        <div className="landing-hero__copy">
          <span className="landing-hero__badge">
            <Sparkles size={14} aria-hidden /> Novo · Repasses automáticos em 1 clique
          </span>
          <h1 className="landing-hero__title">
            O sistema que sua{" "}
            <span className="landing-hero__gradient">imobiliária</span>
            <br /> precisava para crescer.
          </h1>
          <p className="landing-hero__subtitle">
            Gestão completa de contratos, cobranças, repasses e relatórios em uma
            plataforma moderna, rápida e fácil de usar. Tudo o que o
            administrador de imóveis precisa, em um só lugar.
          </p>

          <div className="landing-hero__cta">
            <Link href="/home" className="landing-btn landing-btn--primary">
              Acessar o sistema
              <ArrowRight size={16} aria-hidden />
            </Link>
            <a href="#como-funciona" className="landing-btn landing-btn--ghost">
              <PlayCircle size={16} aria-hidden /> Ver como funciona
            </a>
          </div>

          <div className="landing-hero__trust">
            <ShieldCheck size={14} aria-hidden />
            <span>
              Dados criptografados, LGPD e backups diários. Sem fidelidade.
            </span>
          </div>

          <dl className="landing-hero__stats">
            {stats.map((s) => (
              <div key={s.label} className="landing-hero__stat">
                <dt>{s.value}</dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="landing-hero__visual">
          <div className="landing-hero__glow" aria-hidden />
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}
