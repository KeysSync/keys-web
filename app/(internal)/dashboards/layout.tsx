import DashboardShell from "./components/DashboardShell";
import "./style.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
