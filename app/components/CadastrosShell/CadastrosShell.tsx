import { type ReactNode } from "react";
import { CadastrosTabs } from "@/app/components/CadastrosTabs/CadastrosTabs";

export default function CadastrosShell({ children }: { children: ReactNode }) {
  return (
    <div className="cadastros-shell">
      <CadastrosTabs />
      <div className="cadastros-shell__content">{children}</div>
    </div>
  );
}
