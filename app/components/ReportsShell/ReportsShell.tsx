import { type ReactNode } from "react";
import { ReportsTabs } from "@/app/components/ReportsTabs/ReportsTabs";
import "@/app/components/SectionTabs/section-shell.css";

export default function ReportsShell({ children }: { children: ReactNode }) {
  return (
    <div className="reports-shell">
      <ReportsTabs />
      <div className="reports-shell__content">{children}</div>
    </div>
  );
}
