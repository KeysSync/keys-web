import { type ReactNode } from "react";
import { RelatoriosTabs } from "@/app/components/RelatoriosTabs/RelatoriosTabs";
import "@/app/components/SectionTabs/section-shell.css";

export default function RelatoriosShell({ children }: { children: ReactNode }) {
  return (
    <div className="relatorios-shell">
      <RelatoriosTabs />
      <div className="relatorios-shell__content">{children}</div>
    </div>
  );
}
