import { dashboardColors, getColorAlpha } from "../data/dashboard.mock";
import type { KpiMetric } from "../data/dashboard.mock";

type KpiCardProps = {
  metric: KpiMetric;
};

const KpiCard = ({ metric }: KpiCardProps) => {
  const Icon = metric.icon;
  const accentColor = dashboardColors[metric.color];

  return (
    <article className="dashboard-kpi-card">
      <div
        className="dashboard-kpi-card__icon"
        style={{
          color: accentColor,
          backgroundColor: getColorAlpha(accentColor, 0.12),
          borderColor: getColorAlpha(accentColor, 0.2),
        }}
      >
        <Icon size={30} strokeWidth={1.85} />
      </div>
      <div className="dashboard-kpi-card__content">
        <p className="dashboard-kpi-card__title">{metric.title}</p>
        <p
          className="dashboard-kpi-card__value"
          style={{ color: accentColor }}
        >
          {metric.value}
        </p>
      </div>
    </article>
  );
};

export default KpiCard;
