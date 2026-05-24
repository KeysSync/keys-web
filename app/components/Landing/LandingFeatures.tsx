import {
  Banknote,
  Bell,
  BookText,
  Building2,
  CircleDollarSign,
  FileSpreadsheet,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from "lucide-react";

const features = [
  {
    icon: FileSpreadsheet,
    title: "Contratos sem dor",
    description:
      "Crie, renove e reajuste contratos de locação em poucos cliques. Modelos prontos, assinatura digital e histórico completo.",
    tone: "blue" as const,
  },
  {
    icon: CircleDollarSign,
    title: "Cobrança automática",
    description:
      "Boletos, PIX e cartão integrados aos principais bancos. Conciliação automática, lembretes e régua de cobrança configurável.",
    tone: "green" as const,
  },
  {
    icon: Banknote,
    title: "Repasses no prazo",
    description:
      "Calculamos taxas, comissões, retenções e impostos. O dinheiro chega ao proprietário sem planilhas e sem retrabalho.",
    tone: "purple" as const,
  },
  {
    icon: LayoutDashboard,
    title: "Dashboards em tempo real",
    description:
      "Acompanhe inadimplência, recebimentos, ocupação e DRE com gráficos claros e drill-down até o contrato.",
    tone: "blue" as const,
  },
  {
    icon: Building2,
    title: "Cadastros centralizados",
    description:
      "Imóveis, proprietários, locatários e fiadores em uma base única, com documentos, fotos e auditoria completa.",
    tone: "orange" as const,
  },
  {
    icon: BookText,
    title: "Relatórios sob medida",
    description:
      "Mais de 60 relatórios prontos para Receita, contabilidade e clientes. Exporte em PDF, Excel ou agende por e-mail.",
    tone: "purple" as const,
  },
  {
    icon: Users,
    title: "Portal do cliente",
    description:
      "Proprietários e inquilinos acessam contratos, boletos e demonstrativos em um portal próprio, com sua marca.",
    tone: "blue" as const,
  },
  {
    icon: Bell,
    title: "Avisos inteligentes",
    description:
      "Alertas de vencimentos, renovações, reajustes e inadimplência. Sua equipe nunca mais esquece nada importante.",
    tone: "orange" as const,
  },
  {
    icon: ShieldCheck,
    title: "Segurança e LGPD",
    description:
      "Criptografia em trânsito e em repouso, backups diários, controle de permissões e trilha de auditoria.",
    tone: "green" as const,
  },
];

export default function LandingFeatures() {
  return (
    <section id="recursos" className="landing-section landing-features">
      <header className="landing-section__head">
        <span className="landing-section__eyebrow">Tudo que sua administradora precisa</span>
        <h2 className="landing-section__title">
          Um sistema completo, do contrato ao repasse.
        </h2>
        <p className="landing-section__subtitle">
          Substitua planilhas, e-mails perdidos e ferramentas avulsas por um
          fluxo único, pensado para imobiliárias modernas.
        </p>
      </header>

      <div className="landing-features__grid">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <article
              key={f.title}
              className={`landing-feature landing-feature--${f.tone}`}
            >
              <span className="landing-feature__icon">
                <Icon size={22} aria-hidden />
              </span>
              <h3 className="landing-feature__title">{f.title}</h3>
              <p className="landing-feature__desc">{f.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
