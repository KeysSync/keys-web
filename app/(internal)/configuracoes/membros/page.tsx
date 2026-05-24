import { MembrosDataTable } from "@/app/components/MembrosDataTable";

export default function ConfiguracoesMembrosPage() {
  return (
    <div className="configuracoes-page">
      <header className="configuracoes-page__header">
        <p className="configuracoes-page__desc">
          Convide pessoas e gerencie perfis de acesso da imobiliária.
        </p>
      </header>

      <MembrosDataTable />
    </div>
  );
}
