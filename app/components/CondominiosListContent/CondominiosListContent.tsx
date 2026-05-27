'use client'

import {
  CadastrosListView,
  type CadastrosColumn,
} from '@/app/components/CadastrosListView/CadastrosListView'
import '@/app/components/DeleteConfirmDialog/delete-confirm.css'
import { DeleteConfirmDialog } from '@/app/components/DeleteConfirmDialog/DeleteConfirmDialog'
import { CondominiosFilterDialog } from '@/app/components/CondominiosFilterDialog/CondominiosFilterDialog'
import '@/app/components/RowActionsMenu/row-actions.css'
import {
  RowActionsMenu,
  type RowAction,
} from '@/app/components/RowActionsMenu/RowActionsMenu'
import type { Condominium, CondominiumFilters } from '@/lib/condominiums/api'
import {
  deleteCondominiumAction,
  fetchCondominiumsAction,
} from '@/lib/condominiums/actions'
import { useToast } from '@/lib/toast/use-toast'
import { BuildingIcon, Filter, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'

function filterCondominium(row: Condominium, q: string) {
  return (
    row.code.toLowerCase().includes(q) ||
    row.name.toLowerCase().includes(q) ||
    row.address.street.toLowerCase().includes(q) ||
    row.address.neighborhood.toLowerCase().includes(q) ||
    row.address.city.toLowerCase().includes(q) ||
    row.address.state.toLowerCase().includes(q)
  )
}

export interface CondominiosListContentProps {
  condominiums: Condominium[]
}

export function CondominiosListContent({
  condominiums: initialCondominiums,
}: CondominiosListContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [condominiums, setCondominiums] = useState(initialCondominiums)
  const [deleteTarget, setDeleteTarget] = useState<Condominium | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<CondominiumFilters>({})
  const [isPending, startTransition] = useTransition()

  const hasActiveFilters = Object.keys(filters).length > 0

  const handleApplyFilters = useCallback((newFilters: CondominiumFilters) => {
    setFilters(newFilters)
    startTransition(async () => {
      const hasFilters = Object.keys(newFilters).length > 0
      const result = hasFilters
        ? await fetchCondominiumsAction(newFilters)
        : await fetchCondominiumsAction()
      setCondominiums(result)
    })
  }, [])

  async function handleDelete() {
    if (!deleteTarget) return
    const result = await deleteCondominiumAction(deleteTarget.id)
    setDeleteTarget(null)

    if (result.success) {
      setCondominiums((prev) => prev.filter((c) => c.id !== deleteTarget.id))
      toast({ variant: 'success', title: 'Condomínio excluído com sucesso.' })
    } else {
      toast({
        variant: 'error',
        title: 'Erro ao excluir',
        description: result.error,
      })
    }
  }

  const columns: CadastrosColumn<Condominium>[] = [
    {
      id: 'codigo',
      header: 'Código',
      cell: (row) => (
        <button type="button" className="cadastros-list-code">
          {row.code}
        </button>
      ),
    },
    {
      id: 'condominio',
      header: 'Condomínio',
      cell: (row) => (
        <div className="cadastros-list-entity">
          <span className="cadastros-list-entity-icon">
            <BuildingIcon size={16} />
          </span>
          <span>
            <span className="cadastros-list-entity-title">{row.name}</span>
            <span className="cadastros-list-entity-sub">
              {row.address.street}
              {row.address.number ? `, ${row.address.number}` : ''}
              {row.address.neighborhood
                ? ` — ${row.address.neighborhood}`
                : ''}
            </span>
          </span>
        </div>
      ),
    },
    {
      id: 'cidade',
      header: 'Cidade / UF',
      cell: (row) => (
        <span>
          {row.address.city}
          {row.address.state ? ` / ${row.address.state}` : ''}
        </span>
      ),
    },
    {
      id: 'acoes',
      header: '',
      align: 'center',
      cell: (row) => {
        const actions: RowAction[] = [
          {
            label: 'Editar',
            icon: <Pencil size={14} />,
            onClick: () =>
              router.push(`/imoveis/condominios/editar/${row.id}`),
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
      <CadastrosListView
        entityName="condomínios"
        newButtonLabel="Novo condomínio"
        searchPlaceholder="Buscar código, nome ou cidade…"
        rows={condominiums}
        columns={columns}
        filterRow={filterCondominium}
        getRowKey={(row) => row.id}
        tableLayout="imoveis"
        emptyMessage="Sem registros"
        onRowDoubleClick={(row) =>
          router.push(`/imoveis/condominios/editar/${row.id}`)
        }
        onNewClick={() => router.push('/imoveis/condominios/novo')}
        toolbarExtra={
          <button
            type="button"
            className={`cadastros-list-btn-outline${hasActiveFilters ? ' cadastros-list-btn-outline--active' : ''}`}
            onClick={() => setFilterOpen(true)}
            disabled={isPending}
          >
            <Filter size={18} />
            {isPending ? 'Filtrando…' : 'Filtros'}
            {hasActiveFilters && (
              <span className="cadastros-list-filter-badge">
                {Object.keys(filters).length}
              </span>
            )}
          </button>
        }
      />

      <CondominiosFilterDialog
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
        title="Excluir condomínio"
        description={`O condomínio "${deleteTarget?.name ?? ''}" será apagado permanentemente. Essa ação não pode ser desfeita.`}
        onConfirm={handleDelete}
      />
    </>
  )
}
