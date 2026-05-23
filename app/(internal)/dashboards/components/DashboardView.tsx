import { dashboardMock } from "../data/dashboard.mock";
import DashboardSection from "./DashboardSection";
import FinanceCard from "./FinanceCard";
import KpiCard from "./KpiCard";
import MonthlySituationChart from "./MonthlySituationChart";

const DashboardView = () => {
  const { page, sections, kpiMetrics, financeMetrics } = dashboardMock;

  return (
    <div className="dashboard-page">
      {/* <header className="dashboard-page__header">
        <div>
          <h1 className="dashboard-page__title">{page.title}</h1>
          <p className="dashboard-page__subtitle">{page.subtitle}</p>
        </div>
      </header> */}

      <DashboardSection title={sections.kpi}>
        <div className="dashboard-page__kpi-grid">
          {kpiMetrics.map((metric) => (
            <KpiCard key={metric.id} metric={metric} />
          ))}
        </div>
      </DashboardSection>

      <DashboardSection title={sections.finance}>
        <div className="dashboard-page__finance-grid">
          {financeMetrics.map((metric) => (
            <FinanceCard key={metric.id} metric={metric} />
          ))}
        </div>
      </DashboardSection>

      <DashboardSection title={sections.monthly} className="dashboard-page__monthly">
        <MonthlySituationChart />
      </DashboardSection>
    </div>
  );
};

export default DashboardView;
