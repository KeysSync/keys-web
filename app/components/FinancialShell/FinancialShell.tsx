import { type ReactNode } from "react";
import { FinancialTabs } from "@/app/components/FinancialTabs/FinancialTabs";
import "@/app/components/SectionTabs/section-shell.css";

export default function FinancialShell({ children }: { children: ReactNode }) {
  return (
    <div className="financial-shell">
      <FinancialTabs />
      <div className="financial-shell__content">{children}</div>
    </div>
  );
}
