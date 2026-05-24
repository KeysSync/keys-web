"use client";

import { SectionTabs, type SectionTabItem } from "@/app/components/SectionTabs/SectionTabs";
import { LayersIcon, LayoutDashboardIcon } from "lucide-react";

const dashboardTabs: SectionTabItem[] = [
  {
    value: "dashboard",
    label: "Dashboard",
    href: "/dashboards",
    icon: LayoutDashboardIcon,
  },
  {
    value: "agrupamentos",
    label: "Agrupamentos",
    href: "/dashboards/agrupamentos",
    icon: LayersIcon,
  },
];

export function DashboardTabs() {
  return (
    <SectionTabs
      tabs={dashboardTabs}
      defaultValue="dashboard"
      ariaLabel="Seções do dashboard"
    />
  );
}
