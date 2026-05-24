import type { FinanceMetric } from "@/app/(internal)/dashboards/data/dashboard.mock";

type FinanceCardProps = {
  metric: FinanceMetric;
};

const FinanceCard = ({ metric }: FinanceCardProps) => {
  const Icon = metric.icon;

  return (
    <article
      className="dashboard-finance-card"
      style={
        {
          "--finance-accent": metric.backgroundColor,
        } as React.CSSProperties
      }
    >
      <div className="dashboard-finance-card__glow" aria-hidden />
      <div className="dashboard-finance-card__icon">
        <Icon size={34} strokeWidth={1.85} />
      </div>
      <div className="dashboard-finance-card__content">
        <p className="dashboard-finance-card__title">{metric.title}</p>
        <p className="dashboard-finance-card__value">{metric.value}</p>
      </div>
    </article>
  );
};

export default FinanceCard;
