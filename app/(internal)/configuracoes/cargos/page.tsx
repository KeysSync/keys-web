"use client";

import {
  DataTableList,
  type DataTableColumn,
} from "@/app/components/DataTable";
import { mockCargos, type Cargo } from "@/lib/mocks/cargos";

function filterCargo(row: Cargo, q: string) {
  return (
    row.nome.toLowerCase().includes(q) ||
    row.descricao.toLowerCase().includes(q)
  );
}

const columns: DataTableColumn<Cargo>[] = [
  {
    id: "nome",
    header: "Cargo",
    cell: (row) => (
      <div>
        <span className="cadastros-list-strong">{row.nome}</span>
        <span className="cadastros-list-entity-sub">{row.descricao}</span>
      </div>
    ),
  },
  {
    id: "membros",
    header: "Membros",
    align: "center",
    cell: (row) => (
      <span className="cadastros-list-num">{row.membros}</span>
    ),
  },
];

export default function ConfiguracoesCargosPage() {
  return (
    <div className="configuracoes-page">
      <header className="configuracoes-page__header">
        <h1 className="configuracoes-page__title">Cargos</h1>
        <p className="configuracoes-page__desc">
          Defina perfis de acesso e permissões da equipe.
        </p>
      </header>

      <DataTableList
        entityName="cargos"
        newButtonLabel="Novo cargo"
        searchPlaceholder="Buscar cargo ou descrição…"
        rows={mockCargos}
        columns={columns}
        filterRow={filterCargo}
        getRowKey={(row) => row.id}
        tableLayout="cargos"
        pageSize={5}
      />
    </div>
  );
}
