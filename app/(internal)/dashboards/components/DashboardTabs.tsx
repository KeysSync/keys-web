"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayersIcon, LayoutDashboardIcon, type LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const dashboardTabs: {
  value: string;
  label: string;
  href: string;
  icon: LucideIcon;
}[] = [
  { value: "dashboard", label: "Dashboard", href: "/dashboards", icon: LayoutDashboardIcon },
  { value: "agrupamentos", label: "Agrupamentos", href: "/dashboards/agrupamentos", icon: LayersIcon },
];

function getActiveTab(pathname: string) {
  const match = [...dashboardTabs]
    .sort((a, b) => b.href.length - a.href.length)
    .find(
      (tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`),
    );
  return match?.value ?? "dashboard";
}

export function DashboardTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = getActiveTab(pathname);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        const tab = dashboardTabs.find((item) => item.value === value);
        if (tab) router.push(tab.href);
      }}
      className="dashboard-tabs"
    >
      <TabsList variant="line" aria-label="Seções do dashboard">
        {dashboardTabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="cursor-pointer gap-2"
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
