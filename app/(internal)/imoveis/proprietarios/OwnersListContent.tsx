'use client'

import {
  RecordsListView,
  type RecordsColumn,
} from '@/app/components/RecordsListView/RecordsListView'
import { DeleteConfirmDialog } from '@/app/components/DeleteConfirmDialog/DeleteConfirmDialog'
import '@/app/components/DeleteConfirmDialog/delete-confirm.css'
import {
  RowActionsMenu,
  type RowAction,
} from '@/app/components/RowActionsMenu/RowActionsMenu'
import '@/app/components/RowActionsMenu/row-actions.css'
import { deleteOwnerAction } from '@/lib/owners/actions'
import type { OwnerListRow } from '@/lib/owners/types'
import { useToast } from '@/lib/toast/use-toast'
import { Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function filterOwner(row: OwnerListRow, q: string) {
  return (
    row.name.toLowerCase().includes(q) ||
    row.document.toLowerCase().includes(q) ||
    row.email.toLowerCase().includes(q) ||
    row.phone.toLowerCase().includes(q)
  )
}

interface OwnersListContentProps {
  owners: OwnerListRow[]
}

export default function OwnersListContent({
  owners: initialRows,
}: OwnersListContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [owners, setOwners] = useState(initialRows)
  const [deleteTarget, setDeleteTarget] = useState<OwnerListRow | null>(
    null,
  )

  async function handleDelete() {
    if (!deleteTarget) return
    const id = deleteTarget.id
    const result = await deleteOwnerAction(id)
    setDeleteTarget(null)

    if (result.success) {
      setOwners((prev) => prev.filter((p) => p.id !== id))
      toast({
        variant: 'success',
        title: 'Proprietário excluído com sucesso.',
      })
    } else {
      toast({
        variant: 'error',
        title: 'Erro ao excluir proprietário',
        description: result.error,
      })
    }
  }

  const columns: RecordsColumn<OwnerListRow>[] = [
    {
      id: 'name',
      header: 'Nome',
      cell: (row) => (
        <div>
          <span className="records-list-strong">{row.name}</span>
          <span className="records-list-entity-sub">{row.document}</span>
        </div>
      ),
    },
    {
      id: 'type',
      header: 'Tipo',
      align: 'center',
      cell: (row) => (
        <span className={`records-badge records-badge--type-${row.type}`}>
          {row.type === 'pf' ? 'PF' : 'PJ'}
        </span>
      ),
    },
    {
      id: 'email',
      header: 'E-mail',
      cell: (row) => row.email,
    },
    {
      id: 'phone',
      header: 'Telefone',
      cell: (row) => row.phone,
    },
    {
      id: 'properties',
      header: 'Imóveis',
      align: 'center',
      cell: (row) => (
        <span className="records-list-num">{row.propertiesCount}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      align: 'center',
      cell: (row) => {
        const actions: RowAction[] = [
          {
            label: 'Editar',
            icon: <Pencil size={14} />,
            onClick: () =>
              router.push(`/imoveis/proprietarios/editar/${row.id}`),
          },
          {
            label: 'Apagar',
            icon: <Trash2 size={14} />,
            variant: 'danger',
            onClick: () => setDeleteTarget(row),
          },
        ]
        return <RowActionsMenu actions={actions} />
      },
    },
  ]

  return (
    <>
      <RecordsListView
        entityName="proprietários"
        newButtonLabel="Novo proprietário"
        searchPlaceholder="Buscar nome, documento ou e-mail…"
        rows={owners}
        columns={columns}
        filterRow={filterOwner}
        getRowKey={(row) => row.id}
        tableLayout="people"
        emptyMessage="Sem registros"
        onRowDoubleClick={(row) =>
          router.push(`/imoveis/proprietarios/editar/${row.id}`)
        }
        onNewClick={() => router.push('/imoveis/proprietarios/novo')}
      />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        title="Excluir proprietário"
        description={`O proprietário "${deleteTarget?.name ?? ''}" será apagado permanentemente. Essa ação não pode ser desfeita.`}
        onConfirm={handleDelete}
      />
    </>
  )
}
