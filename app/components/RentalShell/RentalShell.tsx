import { type ReactNode } from "react";
import { RentalTabs } from "@/app/components/RentalTabs/RentalTabs";
import "@/app/components/SectionTabs/section-shell.css";

export default function RentalShell({ children }: { children: ReactNode }) {
  return (
    <div className="rental-shell">
      <RentalTabs />
      <div className="rental-shell__content">{children}</div>
    </div>
  );
}
