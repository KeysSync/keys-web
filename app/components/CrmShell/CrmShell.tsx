import { type ReactNode } from "react";
import { CrmTabs } from "@/app/components/CrmTabs/CrmTabs";
import "@/app/components/SectionTabs/section-shell.css";

export default function CrmShell({ children }: { children: ReactNode }) {
  return (
    <div className="crm-shell">
      <CrmTabs />
      <div className="crm-shell__content">{children}</div>
    </div>
  );
}
