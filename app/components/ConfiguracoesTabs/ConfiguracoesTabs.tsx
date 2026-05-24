"use client";

import { SectionTabs, type SectionTabItem } from "@/app/components/SectionTabs/SectionTabs";
import { Shield, Users } from "lucide-react";

const configuracoesTabs: SectionTabItem[] = [
  {
    value: "membros",
    label: "Membros",
    href: "/configuracoes/membros",
    icon: Users,
  },
  {
    value: "cargos",
    label: "Cargos",
    href: "/configuracoes/cargos",
    icon: Shield,
  },
];

export function ConfiguracoesTabs() {
  return (
    <SectionTabs
      tabs={configuracoesTabs}
      defaultValue="membros"
      ariaLabel="Seções de configurações"
    />
  );
}
