"use client";

import { SectionTabs, type SectionTabItem } from "@/app/components/SectionTabs/SectionTabs";
import {
  Headphones,
  Magnet,
  MapPin,
  UserPlus,
  Workflow,
} from "lucide-react";

const crmTabs: SectionTabItem[] = [
  {
    value: "leads",
    label: "Leads",
    href: "/crm/leads",
    icon: UserPlus,
  },
  {
    value: "atendimentos",
    label: "Atendimentos",
    href: "/crm/atendimentos",
    icon: Headphones,
  },
  {
    value: "visitas",
    label: "Visitas",
    href: "/crm/visitas",
    icon: MapPin,
  },
  {
    value: "pipeline",
    label: "Pipeline",
    href: "/crm/pipeline",
    icon: Workflow,
  },
  {
    value: "captacoes",
    label: "Captações",
    href: "/crm/captacoes",
    icon: Magnet,
  },
];

export function CrmTabs() {
  return (
    <SectionTabs
      tabs={crmTabs}
      defaultValue="leads"
      ariaLabel="Seções de CRM"
    />
  );
}
