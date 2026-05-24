"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

const cadastrosTabs = [
  { value: "imoveis", label: "Imóveis", href: "/cadastros/imoveis" },
  { value: "proprietarios", label: "Proprietários", href: "/cadastros/proprietarios" },
  { value: "inquilinos", label: "Inquilinos", href: "/cadastros/inquilinos" },
] as const;

function getActiveTab(pathname: string) {
  const match = cadastrosTabs.find(
    (tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`),
  );
  return match?.value ?? "imoveis";
}

export function CadastrosTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = getActiveTab(pathname);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        const tab = cadastrosTabs.find((item) => item.value === value);
        if (tab) router.push(tab.href);
      }}
      className="cadastros-tabs"
    >
      <TabsList variant="line" aria-label="Seções de cadastro">
        {cadastrosTabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="cursor-pointer">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
