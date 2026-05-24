import ConfiguracoesShell from "@/app/components/ConfiguracoesShell/ConfiguracoesShell";
import "../cadastros/style.css";
import "./style.css";

export default function ConfiguracoesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="configuracoes-layout">
      <ConfiguracoesShell>{children}</ConfiguracoesShell>
    </div>
  );
}
