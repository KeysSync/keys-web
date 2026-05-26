import { type ReactNode } from "react";
import { FinanceiroTabs } from "@/app/components/FinanceiroTabs/FinanceiroTabs";
import "@/app/components/SectionTabs/section-shell.css";

export default function FinanceiroShell({ children }: { children: ReactNode }) {
  return (
    <div className="financeiro-shell">
      <FinanceiroTabs />
      <div className="financeiro-shell__content">{children}</div>
    </div>
  );
}
