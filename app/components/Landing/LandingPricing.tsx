import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "R$ 149",
    period: "/mês",
    description: "Para quem está começando ou quer testar todo o sistema.",
    cta: "Começar grátis",
    href: "/login",
    highlight: false,
    features: [
      "Até 50 contratos ativos",
      "Boletos PIX e bancários ilimitados",
      "Portal do cliente",
      "Suporte por chat",
    ],
  },
  {
    name: "Pro",
    price: "R$ 349",
    period: "/mês",
    description: "Para administradoras em crescimento que querem escalar.",
    cta: "Quero o plano Pro",
    href: "/login",
    highlight: true,
    badge: "Mais escolhido",
    features: [
      "Até 500 contratos ativos",
      "Repasses automáticos",
      "Conciliação bancária automática",
      "Assinatura digital ilimitada",
      "Relatórios avançados e DRE",
      "Suporte prioritário em até 2h",
    ],
  },
  {
    name: "Enterprise",
    price: "Sob consulta",
    period: "",
    description: "Para grupos, holdings e administradoras com alto volume.",
    cta: "Falar com vendas",
    href: "/login",
    highlight: false,
    features: [
      "Contratos ilimitados",
      "Multi-empresa e multi-filial",
      "SSO e SAML",
      "API e integrações sob medida",
      "Gerente de conta dedicado",
      "SLA de 99,95%",
    ],
  },
];

export default function LandingPricing() {
  return (
    <section id="planos" className="landing-section landing-pricing">
      <header className="landing-section__head">
        <span className="landing-section__eyebrow">Planos</span>
        <h2 className="landing-section__title">
          Preços simples. Crescem com sua imobiliária.
        </h2>
        <p className="landing-section__subtitle">
          Sem fidelidade, sem taxa de implantação e com 14 dias de teste em
          todos os planos.
        </p>
      </header>

      <div className="landing-pricing__grid">
        {plans.map((p) => (
          <article
            key={p.name}
            className={`landing-plan ${p.highlight ? "landing-plan--highlight" : ""}`}
          >
            {p.badge ? (
              <span className="landing-plan__badge">
                <Sparkles size={12} aria-hidden /> {p.badge}
              </span>
            ) : null}

            <header className="landing-plan__head">
              <h3 className="landing-plan__name">{p.name}</h3>
              <div className="landing-plan__price">
                <strong>{p.price}</strong>
                {p.period ? <span>{p.period}</span> : null}
              </div>
              <p className="landing-plan__desc">{p.description}</p>
            </header>

            <ul className="landing-plan__list">
              {p.features.map((f) => (
                <li key={f}>
                  <Check size={14} aria-hidden /> {f}
                </li>
              ))}
            </ul>

            <Link
              href={p.href}
              className={`landing-btn ${p.highlight ? "landing-btn--primary" : "landing-btn--ghost"} landing-plan__cta`}
            >
              {p.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
