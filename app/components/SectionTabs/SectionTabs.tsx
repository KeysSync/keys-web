"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import "./section-tabs.css";

export type SectionTabItem = {
  value: string;
  label: string;
  href: string;
  icon?: LucideIcon;
};

type SectionTabsProps = {
  tabs: readonly SectionTabItem[];
  defaultValue: string;
  ariaLabel: string;
};

function getActiveTab(
  pathname: string,
  tabs: readonly SectionTabItem[],
  defaultValue: string,
) {
  const match = [...tabs]
    .sort((a, b) => b.href.length - a.href.length)
    .find(
      (tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`),
    );

  return match?.value ?? defaultValue;
}

export function SectionTabs({ tabs, defaultValue, ariaLabel }: SectionTabsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = getActiveTab(pathname, tabs, defaultValue);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        const tab = tabs.find((item) => item.value === value);
        if (tab) router.push(tab.href);
      }}
      className="section-tabs"
    >
      <TabsList variant="line" aria-label={ariaLabel}>
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="cursor-pointer gap-2"
            >
              {Icon ? (
                <Icon className="size-4 shrink-0" aria-hidden="true" />
              ) : null}
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
