import { type ReactNode } from "react";
import { LocacaoTabs } from "@/app/components/LocacaoTabs/LocacaoTabs";
import "@/app/components/SectionTabs/section-shell.css";

export default function LocacaoShell({ children }: { children: ReactNode }) {
  return (
    <div className="locacao-shell">
      <LocacaoTabs />
      <div className="locacao-shell__content">{children}</div>
    </div>
  );
}
