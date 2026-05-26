"use client";

import { SectionTabs, type SectionTabItem } from "@/app/components/SectionTabs/SectionTabs";
import {
  BarChart3,
  Building2,
  CircleDollarSign,
  FileText,
  UsersRound,
} from "lucide-react";

const relatoriosTabs: SectionTabItem[] = [
  {
    value: "financeiro",
    label: "Financeiro",
    href: "/relatorios/financeiro",
    icon: CircleDollarSign,
  },
  {
    value: "locacao",
    label: "Locação",
    href: "/relatorios/locacao",
    icon: FileText,
  },
  {
    value: "imoveis",
    label: "Imóveis",
    href: "/relatorios/imoveis",
    icon: Building2,
  },
  {
    value: "crm",
    label: "CRM",
    href: "/relatorios/crm",
    icon: UsersRound,
  },
  {
    value: "ocupacao",
    label: "Ocupação",
    href: "/relatorios/ocupacao",
    icon: BarChart3,
  },
];

export function RelatoriosTabs() {
  return (
    <SectionTabs
      tabs={relatoriosTabs}
      defaultValue="financeiro"
      ariaLabel="Seções de relatórios"
    />
  );
}
