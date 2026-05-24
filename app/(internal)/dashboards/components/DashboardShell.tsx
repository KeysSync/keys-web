import { type ReactNode } from "react";
import { DashboardTabs } from "./DashboardTabs";

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-shell">
      <DashboardTabs />
      <div className="dashboard-shell__content">{children}</div>
    </div>
  );
}
