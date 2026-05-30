import SettingsShell from "@/app/components/SettingsShell/SettingsShell";
import "./style.css";

export default function ConfiguracoesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="settings-layout">
      <SettingsShell>{children}</SettingsShell>
    </div>
  );
}
