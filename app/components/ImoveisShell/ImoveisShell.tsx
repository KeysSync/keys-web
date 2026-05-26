import { type ReactNode } from "react";
import { ImoveisTabs } from "@/app/components/ImoveisTabs/ImoveisTabs";
import "@/app/components/SectionTabs/section-shell.css";

export default function ImoveisShell({ children }: { children: ReactNode }) {
  return (
    <div className="imoveis-shell">
      <ImoveisTabs />
      <div className="imoveis-shell__content">{children}</div>
    </div>
  );
}
