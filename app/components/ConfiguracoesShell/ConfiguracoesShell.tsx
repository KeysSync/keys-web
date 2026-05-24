import { type ReactNode } from "react";
import { ConfiguracoesTabs } from "@/app/components/ConfiguracoesTabs/ConfiguracoesTabs";

export default function ConfiguracoesShell({ children }: { children: ReactNode }) {
  return (
    <div className="configuracoes-shell">
      <ConfiguracoesTabs />
      <div className="configuracoes-shell__content">{children}</div>
    </div>
  );
}
