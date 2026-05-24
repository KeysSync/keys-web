import {
  CalendarClock,
  CheckCircle2,
  FileSignature,
  Repeat2,
  TrendingUp,
  Wallet,
} from "lucide-react";

const cards = [
  {
    icon: TrendingUp,
    title: "Saúde da sua carteira",
    description:
      "Tendências de recebimento, churn de contratos, ocupação e DRE consolidada em um único painel.",
  },
  {
    icon: Wallet,
    title: "Conciliação 100% automática",
    description:
      "Integrações com Santander, Itaú, Bradesco, BB, Sicredi e mais. Os boletos pagos voltam batidos em minutos.",
  },
  {
    icon: FileSignature,
    title: "Assinatura digital nativa",
    description:
      "Contratos assinados em qualquer dispositivo, com validade jurídica e armazenamento seguro.",
  },
  {
    icon: Repeat2,
    title: "Renovações sem esforço",
    description:
      "O Keys identifica reajustes (IGPM, IPCA), envia ao locatário e atualiza o contrato em poucos cliques.",
  },
  {
    icon: CalendarClock,
    title: "Vistorias e laudos",
    description:
      "Agenda, formulários por ambiente, fotos e laudo de entrega — tudo digital, sem papel.",
  },
  {
    icon: CheckCircle2,
    title: "Trilha de auditoria",
    description:
      "Toda alteração registrada com usuário, data e motivo. Conformidade fácil para você e seu cliente.",
  },
];

export default function LandingShowcase() {
  return (
    <section id="diferenciais" className="landing-section landing-showcase">
      <header className="landing-section__head">
        <span className="landing-section__eyebrow">Diferenciais</span>
        <h2 className="landing-section__title">
          Pensado para o jeito brasileiro de administrar imóveis.
        </h2>
        <p className="landing-section__subtitle">
          Cada detalhe foi desenhado para reduzir trabalho operacional e
          aumentar a margem da sua imobiliária.
        </p>
      </header>

      <div className="landing-showcase__grid">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <article key={c.title} className="landing-showcase__card">
              <span className="landing-showcase__icon">
                <Icon size={20} aria-hidden />
              </span>
              <div>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
