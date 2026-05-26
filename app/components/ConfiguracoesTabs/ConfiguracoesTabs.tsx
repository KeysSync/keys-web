"use client";

import { SectionTabs, type SectionTabItem } from "@/app/components/SectionTabs/SectionTabs";
import {
  Building,
  FileCode2,
  Plug,
  Shield,
  Users,
  Zap,
} from "lucide-react";

const configuracoesTabs: SectionTabItem[] = [
  {
    value: "usuarios",
    label: "Usuários",
    href: "/configuracoes/usuarios",
    icon: Users,
  },
  {
    value: "permissoes",
    label: "Permissões",
    href: "/configuracoes/permissoes",
    icon: Shield,
  },
  {
    value: "integracoes",
    label: "Integrações",
    href: "/configuracoes/integracoes",
    icon: Plug,
  },
  {
    value: "automacoes",
    label: "Automações",
    href: "/configuracoes/automacoes",
    icon: Zap,
  },
  {
    value: "templates",
    label: "Templates",
    href: "/configuracoes/templates",
    icon: FileCode2,
  },
  {
    value: "empresa",
    label: "Empresa",
    href: "/configuracoes/empresa",
    icon: Building,
  },
];

export function ConfiguracoesTabs() {
  return (
    <SectionTabs
      tabs={configuracoesTabs}
      defaultValue="usuarios"
      ariaLabel="Seções de configurações"
    />
  );
}
