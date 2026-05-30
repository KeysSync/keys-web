"use client";

import {
  DataTableList,
  type DataTableColumn,
} from "@/app/components/DataTable";
import { Checkbox } from "@/app/components/Checkbox/Checkbox";
import { Toggle } from "@/app/components/Toggle/Toggle";
import {
  roleLabel,
  statusLabel,
  type Member,
  type MemberStatus,
} from "@/lib/members/types";
import { MoreVertical } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { InviteMemberDialog } from "@/app/components/InviteMemberDialog";

function filterMember(row: Member, query: string) {
  return (
    row.name.toLowerCase().includes(query) ||
    row.email.toLowerCase().includes(query) ||
    roleLabel[row.role].toLowerCase().includes(query) ||
    statusLabel[row.status].toLowerCase().includes(query) ||
    row.createdAt.includes(query)
  );
}

type MembersDataTableProps = {
  initialRows?: Member[];
  pageSize?: number;
};

export function MembersDataTable({
  initialRows = [],
  pageSize = 5,
}: MembersDataTableProps) {
  const [members, setMembers] = useState(initialRows);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);

  const allSelected =
    members.length > 0 && selectedIds.length === members.length;
  const someSelected =
    selectedIds.length > 0 && selectedIds.length < members.length;

  const toggleAll = useCallback(() => {
    setSelectedIds((current) =>
      current.length === members.length ? [] : members.map((row) => row.id),
    );
  }, [members]);

  const toggleOne = useCallback((id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }, []);

  const toggleStatus = useCallback((id: string, checked: boolean) => {
    const nextStatus: MemberStatus = checked ? "active" : "inactive";
    setMembers((current) =>
      current.map((member) =>
        member.id === id ? { ...member, status: nextStatus } : member,
      ),
    );
  }, []);

  const columns: DataTableColumn<Member>[] = useMemo(
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
            aria-label={`Selecionar ${row.name}`}
            checked={selectedIds.includes(row.id)}
            onChange={() => toggleOne(row.id)}
          />
        ),
      },
      {
        id: "photo",
        header: "",
        cell: (row) => (
          <span className="members-list-avatar" aria-hidden>
            <img src={row.photo} alt="" />
          </span>
        ),
      },
      {
        id: "name",
        header: "Nome",
        cell: (row) => (
          <span className="records-list-strong members-list-name">
            {row.name}
          </span>
        ),
      },
      {
        id: "role",
        header: "Cargo",
        cell: (row) => (
          <span className={`records-badge records-badge--role-${row.role}`}>
            {roleLabel[row.role]}
          </span>
        ),
      },
      {
        id: "status",
        header: "Status",
        align: "center",
        cell: (row) => (
          <Toggle
            className="members-list-toggle"
            checked={row.status === "active"}
            onChange={(event) => toggleStatus(row.id, event.target.checked)}
            aria-label={`Status de ${row.name}`}
          />
        ),
      },
      {
        id: "createdAt",
        header: "Data de criação",
        cell: (row) => (
          <span className="members-list-date">{row.createdAt}</span>
        ),
      },
      {
        id: "actions",
        header: "",
        align: "center",
        cell: (row) => (
          <button
            type="button"
            className="members-list-action"
            aria-label={`Editar ${row.name}`}
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
        entityName="members"
        newButtonLabel="Convidar membro"
        searchPlaceholder="Buscar nome, e-mail ou cargo…"
        rows={members}
        columns={columns}
        filterRow={filterMember}
        getRowKey={(row) => row.id}
        tableLayout="members"
        pageSize={pageSize}
        isRowSelected={(row) => selectedIds.includes(row.id)}
        onRowClick={(row) => toggleOne(row.id)}
        onNewClick={() => setInviteOpen(true)}
      />

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </>
  );
}
