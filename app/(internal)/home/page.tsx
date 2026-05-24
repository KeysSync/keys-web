import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  Building2,
  CalendarClock,
  CircleDollarSign,
  CopyPlus,
  FileSpreadsheet,
  Flag,
  HandCoins,
  House,
  Logs,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { displayName, getCurrentUser } from "@/lib/auth/session";
import "./style.css";

const quickMetrics = [
  {
    id: "contratos-ativos",
    label: "Contratos ativos",
    value: "1.284",
    delta: "+4,2%",
    icon: FileSpreadsheet,
    tone: "info" as const,
  },
  {
    id: "recebido-mes",
    label: "Recebido este mês",
    value: "R$ 2,84 mi",
    delta: "+12,7%",
    icon: HandCoins,
    tone: "success" as const,
  },
  {
    id: "inadimplencia",
    label: "Inadimplência",
    value: "3,1%",
    delta: "-0,6 pp",
    icon: TrendingUp,
    tone: "warning" as const,
  },
  {
    id: "imoveis",
    label: "Imóveis sob gestão",
    value: "2.412",
    delta: "+38",
    icon: Building2,
    tone: "purple" as const,
  },
];

const shortcuts = [
  {
    href: "/dashboards",
    title: "Dashboards",
    description: "Acompanhe indicadores em tempo real",
    icon: House,
  },
  {
    href: "/contratos/criar",
    title: "Novo contrato",
    description: "Crie um contrato em minutos",
    icon: FileSpreadsheet,
  },
  {
    href: "/lancamentos",
    title: "Lançamentos",
    description: "Receba, gere boletos e concilie",
    icon: BadgePercent,
  },
  {
    href: "/financeiro",
    title: "Financeiro",
    description: "Repasses, comissões e acertos",
    icon: CircleDollarSign,
  },
  {
    href: "/cadastros",
    title: "Cadastros",
    description: "Imóveis, locatários e proprietários",
    icon: CopyPlus,
  },
  {
    href: "/relatorios",
    title: "Relatórios",
    description: "Exporte e analise sua carteira",
    icon: Flag,
  },
];

const agenda = [
  {
    id: "1",
    title: "12 boletos vencem amanhã",
    time: "Próximas 24h",
    icon: CalendarClock,
    tone: "warning" as const,
  },
  {
    id: "2",
    title: "5 vistorias agendadas",
    time: "Esta semana",
    icon: ShieldCheck,
    tone: "info" as const,
  },
  {
    id: "3",
    title: "3 contratos para renovação",
    time: "Próximos 30 dias",
    icon: FileSpreadsheet,
    tone: "purple" as const,
  },
  {
    id: "4",
    title: "2 novos cadastros aguardando",
    time: "Hoje",
    icon: Users,
    tone: "success" as const,
  },
];

const activity = [
  {
    id: "a1",
    text: "Boleto #28394 quitado por João Silva",
    when: "há 12 min",
  },
  {
    id: "a2",
    text: "Contrato CNT-1023 renovado com sucesso",
    when: "há 38 min",
  },
  {
    id: "a3",
    text: "Repasse processado para Maria Oliveira",
    when: "há 1h",
  },
  {
    id: "a4",
    text: "Novo imóvel cadastrado: Edifício Vista Mar",
    when: "há 2h",
  },
  {
    id: "a5",
    text: "Notificação enviada para 18 inadimplentes",
    when: "há 3h",
  },
];

export default async function HomePage() {
  const user = await getCurrentUser();
  const firstName = displayName(user).split(" ")[0];

  return (
    <div className="home-page">
      <header className="home-hero">
        <div className="home-hero__intro">
          <span className="home-hero__badge">
            <Sparkles size={14} aria-hidden /> Bem-vindo de volta, {firstName}
          </span>
          <h1 className="home-hero__title">Sua imobiliária em um só lugar</h1>
          <p className="home-hero__subtitle">
            Visão executiva da sua operação: indicadores, atalhos e o que precisa
            da sua atenção hoje.
          </p>
        </div>

        <div className="home-hero__actions">
          <Link className="home-btn home-btn--primary" href="/dashboards">
            Abrir dashboards
            <ArrowRight size={16} aria-hidden />
          </Link>
          <Link className="home-btn home-btn--ghost" href="/contratos/criar">
            Novo contrato
          </Link>
        </div>
      </header>

      <section className="home-section">
        <div className="home-metrics">
          {quickMetrics.map((m) => {
            const Icon = m.icon;
            return (
              <article
                key={m.id}
                className={`home-metric home-metric--${m.tone}`}
              >
                <div className="home-metric__icon">
                  <Icon size={18} aria-hidden />
                </div>
                <div className="home-metric__body">
                  <span className="home-metric__label">{m.label}</span>
                  <strong className="home-metric__value">{m.value}</strong>
                  <span className="home-metric__delta">{m.delta}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="home-section">
        <header className="home-section__head">
          <h2 className="home-section__title">Atalhos rápidos</h2>
          <p className="home-section__hint">
            Comece pelo que você usa todo dia.
          </p>
        </header>

        <div className="home-shortcuts">
          {shortcuts.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.href} href={s.href} className="home-shortcut">
                <span className="home-shortcut__icon">
                  <Icon size={20} aria-hidden />
                </span>
                <span className="home-shortcut__body">
                  <strong>{s.title}</strong>
                  <span>{s.description}</span>
                </span>
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="home-shortcut__arrow"
                />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home-grid">
        <article className="home-card">
          <header className="home-card__head">
            <h2 className="home-card__title">Para sua atenção</h2>
            <span className="home-card__hint">Próximos eventos</span>
          </header>
          <ul className="home-list">
            {agenda.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.id}
                  className={`home-list__item home-list__item--${item.tone}`}
                >
                  <span className="home-list__icon">
                    <Icon size={16} aria-hidden />
                  </span>
                  <div className="home-list__text">
                    <strong>{item.title}</strong>
                    <span>{item.time}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </article>

        <article className="home-card">
          <header className="home-card__head">
            <h2 className="home-card__title">Atividade recente</h2>
            <Link href="/logs" className="home-card__link">
              ver tudo <Logs size={14} aria-hidden />
            </Link>
          </header>
          <ul className="home-activity">
            {activity.map((a) => (
              <li key={a.id} className="home-activity__item">
                <span className="home-activity__dot" />
                <div className="home-activity__text">
                  <span>{a.text}</span>
                  <small>{a.when}</small>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
