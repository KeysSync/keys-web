"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { CadastrosTabs } from "./CadastrosTabs";

export default function CadastrosShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getSession()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="cadastros-loading">
        <p>Carregando…</p>
      </div>
    );
  }

  return (
    <div className="cadastros-page">
      <header className="cadastros-header">
        <div className="cadastros-header-text">
          <h1 className="cadastros-title">Cadastros</h1>
          <p className="cadastros-desc">
            Gerencie imóveis, proprietários e inquilinos da sua carteira.
          </p>
        </div>
      </header>

      <CadastrosTabs />

      <div className="cadastros-content">{children}</div>
    </div>
  );
}
