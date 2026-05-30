"use client";

import { SectionTabs, type SectionTabItem } from "@/app/components/SectionTabs/SectionTabs";
import {
  Building2,
  BuildingIcon,
  CalendarCheck,
  LayoutGrid,
  SunIcon,
  UserRound,
} from "lucide-react";

const propertiesTabs: SectionTabItem[] = [
  {
    value: "imoveis",
    label: "Imóveis",
    href: "/imoveis",
    icon: Building2,
  },
  {
    value: "proprietarios",
    label: "Proprietários",
    href: "/imoveis/proprietarios",
    icon: UserRound,
  },
  {
    value: "condominios",
    label: "Condomínios",
    href: "/imoveis/condominios",
    icon: BuildingIcon,
  },
  {
    value: "categorias",
    label: "Categorias",
    href: "/imoveis/categorias",
    icon: LayoutGrid,
  },
  {
    value: "reservas",
    label: "Reservas",
    href: "/imoveis/reservas",
    icon: CalendarCheck,
  },
  {
    value: "temporada",
    label: "Temporada",
    href: "/imoveis/temporada",
    icon: SunIcon,
  },
];

export function PropertiesTabs() {
  return (
    <SectionTabs
      tabs={propertiesTabs}
      defaultValue="imoveis"
      ariaLabel="Seções de imóveis"
    />
  );
}
