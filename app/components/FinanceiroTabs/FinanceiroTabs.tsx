"use client";

import { SectionTabs, type SectionTabItem } from "@/app/components/SectionTabs/SectionTabs";
import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowLeftRight,
  ArrowUpCircle,
  BadgePercent,
  Banknote,
} from "lucide-react";

const financeiroTabs: SectionTabItem[] = [
  {
    value: "lancamentos",
    label: "Lançamentos",
    href: "/financeiro/lancamentos",
    icon: BadgePercent,
  },
  {
    value: "repasses",
    label: "Repasses",
    href: "/financeiro/repasses",
    icon: ArrowLeftRight,
  },
  {
    value: "cobrancas",
    label: "Cobranças",
    href: "/financeiro/cobrancas",
    icon: Banknote,
  },
  {
    value: "inadimplencia",
    label: "Inadimplência",
    href: "/financeiro/inadimplencia",
    icon: AlertTriangle,
  },
  {
    value: "contas-a-pagar",
    label: "Contas a pagar",
    href: "/financeiro/contas-a-pagar",
    icon: ArrowUpCircle,
  },
  {
    value: "contas-a-receber",
    label: "Contas a receber",
    href: "/financeiro/contas-a-receber",
    icon: ArrowDownCircle,
  },
];

export function FinanceiroTabs() {
  return (
    <SectionTabs
      tabs={financeiroTabs}
      defaultValue="lancamentos"
      ariaLabel="Seções de financeiro"
    />
  );
}
