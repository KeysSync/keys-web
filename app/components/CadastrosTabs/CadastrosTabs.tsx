"use client";

import { SectionTabs, type SectionTabItem } from "@/app/components/SectionTabs/SectionTabs";
import { Building2, UserRound, Users } from "lucide-react";

const cadastrosTabs: SectionTabItem[] = [
  {
    value: "imoveis",
    label: "Imóveis",
    href: "/cadastros/imoveis",
    icon: Building2,
  },
  {
    value: "proprietarios",
    label: "Proprietários",
    href: "/cadastros/proprietarios",
    icon: UserRound,
  },
  {
    value: "inquilinos",
    label: "Inquilinos",
    href: "/cadastros/inquilinos",
    icon: Users,
  },
];

export function CadastrosTabs() {
  return (
    <SectionTabs
      tabs={cadastrosTabs}
      defaultValue="imoveis"
      ariaLabel="Seções de cadastro"
    />
  );
}
