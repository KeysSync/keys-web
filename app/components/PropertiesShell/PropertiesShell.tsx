import { type ReactNode } from "react";
import { PropertiesTabs } from "@/app/components/PropertiesTabs/PropertiesTabs";
import "@/app/components/SectionTabs/section-shell.css";

export default function PropertiesShell({ children }: { children: ReactNode }) {
  return (
    <div className="properties-shell">
      <PropertiesTabs />
      <div className="properties-shell__content">{children}</div>
    </div>
  );
}
