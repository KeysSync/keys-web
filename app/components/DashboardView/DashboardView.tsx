import { dashboardMock } from "@/app/(internal)/dashboards/data/dashboard.mock";
import DashboardSection from "@/app/components/DashboardSection/DashboardSection";
import FinanceCard from "@/app/components/FinanceCard/FinanceCard";
import KpiCard from "@/app/components/KpiCard/KpiCard";
import MonthlySituationChart from "@/app/components/MonthlySituationChart/MonthlySituationChart";

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
