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
import { TenantsFilterDialog } from '@/app/components/TenantsFilterDialog/TenantsFilterDialog'
import {
  deleteTenantAction,
  fetchInquilinosAction,
} from '@/lib/tenants/actions'
import type { TenantListRow, TenantUserFilters } from '@/lib/tenants/api'
import { useToast } from '@/lib/toast/use-toast'
import { Filter, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'

function filterTenant(row: TenantListRow, q: string) {
  return (
    row.name.toLowerCase().includes(q) ||
    row.document.toLowerCase().includes(q) ||
    row.email.toLowerCase().includes(q) ||
    row.phone.toLowerCase().includes(q)
  )
}

interface TenantsListContentProps {
  tenants: TenantListRow[]
}

export default function TenantsListContent({
  tenants: initialRows,
}: TenantsListContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [tenants, setTenants] = useState(initialRows)
  const [deleteTarget, setDeleteTarget] = useState<TenantListRow | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<TenantUserFilters>({})
  const [isPending, startTransition] = useTransition()

  const hasActiveFilters = Object.keys(filters).length > 0

  const handleApplyFilters = useCallback((newFilters: TenantUserFilters) => {
    setFilters(newFilters)
    startTransition(async () => {
      const hasFilters = Object.keys(newFilters).length > 0
      const result = hasFilters
        ? await fetchInquilinosAction(newFilters)
        : await fetchInquilinosAction()
      setTenants(result)
    })
  }, [])

  async function handleDelete() {
    if (!deleteTarget) return
    const id = deleteTarget.id
    const result = await deleteTenantAction(id)
    setDeleteTarget(null)

    if (result.success) {
      setTenants((prev) => prev.filter((row) => row.id !== id))
      toast({
        variant: 'success',
        title: 'Inquilino excluído com sucesso.',
      })
    } else {
      toast({
        variant: 'error',
        title: 'Erro ao excluir inquilino',
        description: result.error,
      })
    }
  }

  const columns: RecordsColumn<TenantListRow>[] = [
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
      id: 'actions',
      header: '',
      align: 'center',
      cell: (row) => {
        const actions: RowAction[] = [
          {
            label: 'Editar',
            icon: <Pencil size={14} />,
            onClick: () => router.push(`/locacao/inquilinos/editar/${row.id}`),
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
        entityName="inquilinos"
        newButtonLabel="Novo inquilino"
        searchPlaceholder="Buscar nome, documento ou e-mail…"
        rows={tenants}
        columns={columns}
        filterRow={filterTenant}
        getRowKey={(row) => row.id}
        tableLayout="people"
        emptyMessage="Sem registros"
        onRowDoubleClick={(row) =>
          router.push(`/locacao/inquilinos/editar/${row.id}`)
        }
        onNewClick={() => router.push('/locacao/inquilinos/novo')}
        toolbarExtra={
          <button
            type="button"
            className={`records-list-btn-outline${hasActiveFilters ? ' records-list-btn-outline--active' : ''}`}
            onClick={() => setFilterOpen(true)}
            disabled={isPending}
          >
            <Filter size={18} />
            {isPending ? 'Filtrando…' : 'Filtros'}
            {hasActiveFilters && (
              <span className="records-list-filter-badge">
                {Object.keys(filters).length}
              </span>
            )}
          </button>
        }
      />

      <TenantsFilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        currentFilters={filters}
        onApply={handleApplyFilters}
      />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        title="Excluir inquilino"
        description={`O inquilino "${deleteTarget?.name ?? ''}" será apagado permanentemente. Essa ação não pode ser desfeita.`}
        onConfirm={handleDelete}
      />
    </>
  )
}
