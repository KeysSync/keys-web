"use client";

import {
  DataTableList,
  type DataTableColumn,
} from "@/app/components/DataTable";
import type { Role } from "@/lib/roles/types";

function filterRole(row: Role, q: string) {
  return (
    row.name.toLowerCase().includes(q) ||
    row.description.toLowerCase().includes(q)
  );
}

const columns: DataTableColumn<Role>[] = [
  {
    id: "name",
    header: "Cargo",
    cell: (row) => (
      <div>
        <span className="records-list-strong">{row.name}</span>
        <span className="records-list-entity-sub">{row.description}</span>
      </div>
    ),
  },
  {
    id: "members",
    header: "Members",
    align: "center",
    cell: (row) => (
      <span className="records-list-num">{row.memberCount}</span>
    ),
  },
];

export default function ConfiguracoesPermissoesPage() {
  return (
    <div className="configuracoes-page">
      <header className="configuracoes-page__header">
        <h1 className="configuracoes-page__title">Permissões</h1>
        <p className="configuracoes-page__desc">
          Defina perfis de acesso e permissões da equipe.
        </p>
      </header>

      <DataTableList
        entityName="roles"
        newButtonLabel="Novo cargo"
        searchPlaceholder="Buscar cargo ou descrição…"
        rows={[]}
        columns={columns}
        filterRow={filterRole}
        getRowKey={(row) => row.id}
        tableLayout="roles"
        pageSize={5}
      />
    </div>
  );
}
