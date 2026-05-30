"use client";

import { SectionTabs, type SectionTabItem } from "@/app/components/SectionTabs/SectionTabs";
import {
  ClipboardCheck,
  FileText,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

const locacaoTabs: SectionTabItem[] = [
  {
    value: "contratos",
    label: "Contratos",
    href: "/locacao/contratos",
    icon: FileText,
  },
  {
    value: "inquilinos",
    label: "Inquilinos",
    href: "/locacao/inquilinos",
    icon: Users,
  },
  {
    value: "garantias",
    label: "Garantias",
    href: "/locacao/garantias",
    icon: ShieldCheck,
  },
  {
    value: "vistorias",
    label: "Vistorias",
    href: "/locacao/vistorias",
    icon: ClipboardCheck,
  },
  {
    value: "reajustes",
    label: "Reajustes",
    href: "/locacao/reajustes",
    icon: TrendingUp,
  },
  {
    value: "renovacoes",
    label: "Renovações",
    href: "/locacao/renovacoes",
    icon: RefreshCw,
  },
];

export function RentalTabs() {
  return (
    <SectionTabs
      tabs={locacaoTabs}
      defaultValue="contratos"
      ariaLabel="Seções de locação"
    />
  );
}
