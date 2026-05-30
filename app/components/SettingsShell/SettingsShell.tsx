import { type ReactNode } from "react";
import { SettingsTabs } from "@/app/components/SettingsTabs/SettingsTabs";

export default function SettingsShell({ children }: { children: ReactNode }) {
  return (
    <div className="settings-shell">
      <SettingsTabs />
      <div className="settings-shell__content">{children}</div>
    </div>
  );
}
