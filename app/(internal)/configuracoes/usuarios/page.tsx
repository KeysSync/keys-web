import { MembersDataTable } from "@/app/components/MembersDataTable";

export default function ConfiguracoesUsuariosPage() {
  return (
    <div className="configuracoes-page">
      <header className="configuracoes-page__header">
        <p className="configuracoes-page__desc">
          Convide pessoas e gerencie perfis de acesso da imobiliária.
        </p>
      </header>
      <MembersDataTable />
    </div>
  );
}
