import CadastrosShell from "./components/CadastrosShell";
import "./style.css";

export default function CadastrosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="cadastros-layout">
      <CadastrosShell>{children}</CadastrosShell>
    </div>
  );
}
