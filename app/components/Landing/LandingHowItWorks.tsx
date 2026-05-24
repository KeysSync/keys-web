import { ClipboardList, Rocket, Zap } from "lucide-react";

const steps = [
  {
    n: "01",
    title: "Importe sua carteira",
    description:
      "Migração assistida em até 7 dias. Importamos imóveis, contratos, locatários, proprietários e histórico financeiro do seu sistema atual.",
    icon: ClipboardList,
  },
  {
    n: "02",
    title: "Configure em minutos",
    description:
      "Defina taxa de administração, régua de cobrança, integrações bancárias e modelos de contrato. Wizard guiado, sem precisar de TI.",
    icon: Zap,
  },
  {
    n: "03",
    title: "Opere com tranquilidade",
    description:
      "Sua equipe trabalha em um único lugar. Boletos, repasses e relatórios acontecem em segundo plano enquanto você foca em crescer.",
    icon: Rocket,
  },
];

export default function LandingHowItWorks() {
  return (
    <section id="como-funciona" className="landing-section landing-how">
      <header className="landing-section__head">
        <span className="landing-section__eyebrow">Como funciona</span>
        <h2 className="landing-section__title">
          Saia das planilhas em 3 passos.
        </h2>
        <p className="landing-section__subtitle">
          Implantação rápida, sem custo de migração e com o nosso time ao seu
          lado de ponta a ponta.
        </p>
      </header>

      <ol className="landing-how__steps">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <li key={s.n} className="landing-how__step">
              <div className="landing-how__step-head">
                <span className="landing-how__step-n">{s.n}</span>
                <span className="landing-how__step-icon">
                  <Icon size={18} aria-hidden />
                </span>
              </div>
              <h3 className="landing-how__step-title">{s.title}</h3>
              <p className="landing-how__step-desc">{s.description}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
