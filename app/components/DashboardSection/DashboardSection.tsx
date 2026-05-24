type DashboardSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

const DashboardSection = ({
  title,
  description,
  children,
  className = "",
}: DashboardSectionProps) => {
  return (
    <section className={`dashboard-section ${className}`.trim()}>
      <header className="dashboard-section__header">
        <h2 className="dashboard-section__title">{title}</h2>
        {description ? (
          <p className="dashboard-section__description">{description}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
};

export default DashboardSection;
