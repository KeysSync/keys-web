import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Building2,
  CircleDollarSign,
  FileSpreadsheet,
  Search,
  TrendingUp,
} from "lucide-react";

const kpis = [
  {
    label: "Contratos ativos",
    value: "1.284",
    delta: "+4,2%",
    up: true,
    color: "info" as const,
    icon: FileSpreadsheet,
  },
  {
    label: "Recebido no mês",
    value: "R$ 2,84mi",
    delta: "+12,7%",
    up: true,
    color: "success" as const,
    icon: CircleDollarSign,
  },
  {
    label: "Inadimplência",
    value: "3,1%",
    delta: "-0,6 pp",
    up: false,
    color: "warning" as const,
    icon: TrendingUp,
  },
  {
    label: "Imóveis sob gestão",
    value: "2.412",
    delta: "+38",
    up: true,
    color: "purple" as const,
    icon: Building2,
  },
];

const bars = [
  { m: "Jan", h: 48 },
  { m: "Fev", h: 62 },
  { m: "Mar", h: 56 },
  { m: "Abr", h: 70 },
  { m: "Mai", h: 78 },
  { m: "Jun", h: 65 },
  { m: "Jul", h: 84 },
  { m: "Ago", h: 90 },
  { m: "Set", h: 76 },
  { m: "Out", h: 88 },
  { m: "Nov", h: 95 },
  { m: "Dez", h: 100 },
];

export default function DashboardMockup() {
  return (
    <div className="landing-mockup" aria-hidden>
      <div className="landing-mockup__chrome">
        <span className="landing-mockup__dot landing-mockup__dot--red" />
        <span className="landing-mockup__dot landing-mockup__dot--yellow" />
        <span className="landing-mockup__dot landing-mockup__dot--green" />
        <div className="landing-mockup__url">keys.app/dashboards</div>
      </div>

      <div className="landing-mockup__app">
        <aside className="landing-mockup__sidebar">
          <div className="landing-mockup__logo" />
          <ul>
            <li className="is-active" />
            <li />
            <li />
            <li />
            <li />
            <li />
          </ul>
        </aside>

        <div className="landing-mockup__main">
          <header className="landing-mockup__topbar">
            <div className="landing-mockup__greeting">
              <strong>Olá, Ana</strong>
              <span>Segunda, 24 de maio</span>
            </div>
            <div className="landing-mockup__search">
              <Search size={14} />
              <span>Buscar contratos, imóveis...</span>
            </div>
            <div className="landing-mockup__topbar-actions">
              <Bell size={16} />
              <div className="landing-mockup__avatar" />
            </div>
          </header>

          <section className="landing-mockup__kpis">
            {kpis.map((k) => {
              const Icon = k.icon;
              return (
                <div
                  key={k.label}
                  className={`landing-mockup__kpi landing-mockup__kpi--${k.color}`}
                >
                  <div className="landing-mockup__kpi-head">
                    <span className="landing-mockup__kpi-icon">
                      <Icon size={14} />
                    </span>
                    <span
                      className={`landing-mockup__kpi-delta ${k.up ? "is-up" : "is-down"}`}
                    >
                      {k.up ? (
                        <ArrowUpRight size={12} />
                      ) : (
                        <ArrowDownRight size={12} />
                      )}
                      {k.delta}
                    </span>
                  </div>
                  <strong className="landing-mockup__kpi-value">{k.value}</strong>
                  <span className="landing-mockup__kpi-label">{k.label}</span>
                </div>
              );
            })}
          </section>

          <section className="landing-mockup__chart">
            <header>
              <strong>Recebimentos mensais</strong>
              <span>Últimos 12 meses</span>
            </header>
            <div className="landing-mockup__bars">
              {bars.map((b) => (
                <div key={b.m} className="landing-mockup__bar-col">
                  <div
                    className="landing-mockup__bar"
                    style={{ height: `${b.h}%` }}
                  />
                  <span>{b.m}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="landing-mockup__bottom">
            <div className="landing-mockup__list">
              <header>
                <strong>Próximos vencimentos</strong>
              </header>
              <ul>
                {[
                  "Boleto #28394 · João Silva",
                  "Boleto #28401 · Marina Costa",
                  "Boleto #28412 · Pedro Almeida",
                  "Boleto #28415 · Luísa Ramos",
                ].map((t, i) => (
                  <li key={i}>
                    <span className="landing-mockup__list-dot" />
                    <span>{t}</span>
                    <small>R$ {(2000 + i * 350).toLocaleString("pt-BR")},00</small>
                  </li>
                ))}
              </ul>
            </div>

            <div className="landing-mockup__donut">
              <header>
                <strong>Inadimplência</strong>
              </header>
              <div className="landing-mockup__donut-wrap">
                <svg viewBox="0 0 36 36" className="landing-mockup__donut-svg">
                  <circle cx="18" cy="18" r="15.9" className="bg" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    className="fg"
                    strokeDasharray="3.1, 100"
                  />
                </svg>
                <div className="landing-mockup__donut-center">
                  <strong>3,1%</strong>
                  <span>vs 3,7% anterior</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
