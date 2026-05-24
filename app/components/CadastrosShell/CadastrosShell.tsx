import { type ReactNode } from "react";
import { CadastrosTabs } from "@/app/components/CadastrosTabs/CadastrosTabs";

export default function CadastrosShell({ children }: { children: ReactNode }) {
  return (
    <div className="cadastros-page">
      <header className="cadastros-header">
        <div className="cadastros-header-text">
          <p className="cadastros-desc">
            Gerencie imóveis, proprietários e inquilinos da sua carteira.
          </p>
        </div>
      </header>

      <CadastrosTabs />

      <div className="cadastros-content">{children}</div>
    </div>
  );
}
