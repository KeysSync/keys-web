"use client";

import {
  DataTableList,
  type DataTableColumn,
} from "@/app/components/DataTable";
import { Checkbox } from "@/app/components/Checkbox/Checkbox";
import { Toggle } from "@/app/components/Toggle/Toggle";
import {
  mockMembros,
  perfilLabel,
  statusLabel,
  type Membro,
  type MembroStatus,
} from "@/lib/mocks/membros";
import { MoreVertical } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { InviteMembroDialog } from "@/app/components/InviteMembroDialog";

function filterMembro(row: Membro, query: string) {
  return (
    row.nome.toLowerCase().includes(query) ||
    row.email.toLowerCase().includes(query) ||
    perfilLabel[row.perfil].toLowerCase().includes(query) ||
    statusLabel[row.status].toLowerCase().includes(query) ||
    row.dataCriacao.includes(query)
  );
}

type MembrosDataTableProps = {
  initialRows?: Membro[];
  pageSize?: number;
};

export function MembrosDataTable({
  initialRows = mockMembros,
  pageSize = 5,
}: MembrosDataTableProps) {
  const [membros, setMembros] = useState(initialRows);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);

  const allSelected =
    membros.length > 0 && selectedIds.length === membros.length;
  const someSelected =
    selectedIds.length > 0 && selectedIds.length < membros.length;

  const toggleAll = useCallback(() => {
    setSelectedIds((current) =>
      current.length === membros.length ? [] : membros.map((row) => row.id),
    );
  }, [membros]);

  const toggleOne = useCallback((id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }, []);

  const toggleStatus = useCallback((id: string, checked: boolean) => {
    const nextStatus: MembroStatus = checked ? "ativo" : "inativo";
    setMembros((current) =>
      current.map((membro) =>
        membro.id === id ? { ...membro, status: nextStatus } : membro,
      ),
    );
  }, []);

  const columns: DataTableColumn<Membro>[] = useMemo(
    () => [
      {
        id: "select",
        headerCell: (
          <Checkbox
            aria-label="Selecionar todos os membros"
            checked={allSelected}
            indeterminate={someSelected}
            onChange={toggleAll}
          />
        ),
        cell: (row) => (
          <Checkbox
            aria-label={`Selecionar ${row.nome}`}
            checked={selectedIds.includes(row.id)}
            onChange={() => toggleOne(row.id)}
          />
        ),
      },
      {
        id: "foto",
        header: "",
        cell: (row) => (
          <span className="membros-list-avatar" aria-hidden>
            <img src={row.foto} alt="" />
          </span>
        ),
      },
      {
        id: "nome",
        header: "Nome",
        cell: (row) => (
          <span className="cadastros-list-strong membros-list-name">
            {row.nome}
          </span>
        ),
      },
      {
        id: "role",
        header: "Cargo",
        cell: (row) => (
          <span className={`cadastros-badge cadastros-badge--perfil-${row.perfil}`}>
            {perfilLabel[row.perfil]}
          </span>
        ),
      },
      {
        id: "status",
        header: "Status",
        align: "center",
        cell: (row) => (
          <Toggle
            className="membros-list-toggle"
            checked={row.status === "ativo"}
            onChange={(event) => toggleStatus(row.id, event.target.checked)}
            aria-label={`Status de ${row.nome}`}
          />
        ),
      },
      {
        id: "dataCriacao",
        header: "Data de criação",
        cell: (row) => (
          <span className="membros-list-date">{row.dataCriacao}</span>
        ),
      },
      {
        id: "acoes",
        header: "",
        align: "center",
        cell: (row) => (
          <button
            type="button"
            className="membros-list-action"
            aria-label={`Editar ${row.nome}`}
          >
            <MoreVertical size={18} aria-hidden />
          </button>
        ),
      },
    ],
    [allSelected, someSelected, selectedIds, toggleAll, toggleOne, toggleStatus],
  );

  return (
    <>
      <DataTableList
        entityName="membros"
        newButtonLabel="Convidar membro"
        searchPlaceholder="Buscar nome, e-mail ou cargo…"
        rows={membros}
        columns={columns}
        filterRow={filterMembro}
        getRowKey={(row) => row.id}
        tableLayout="membros"
        pageSize={pageSize}
        isRowSelected={(row) => selectedIds.includes(row.id)}
        onRowClick={(row) => toggleOne(row.id)}
        onNewClick={() => setInviteOpen(true)}
      />

      <InviteMembroDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </>
  );
}
