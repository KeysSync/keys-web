'use client'

import {
  RecordsListView,
  type RecordsColumn,
} from '@/app/components/RecordsListView/RecordsListView'
import '@/app/components/DeleteConfirmDialog/delete-confirm.css'
import { DeleteConfirmDialog } from '@/app/components/DeleteConfirmDialog/DeleteConfirmDialog'
import { PropertiesFilterDialog } from '@/app/components/PropertiesFilterDialog/PropertiesFilterDialog'
import '@/app/components/RowActionsMenu/row-actions.css'
import {
  RowActionsMenu,
  type RowAction,
} from '@/app/components/RowActionsMenu/RowActionsMenu'
import type { Category, Property, PropertyFilters, PropertyStatus, Subcategory } from '@/lib/properties/api'
import { deletePropertyAction, fetchPropertiesAction } from '@/lib/properties/actions'
import { useToast } from '@/lib/toast/use-toast'
import { Building2, Filter, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'

const statusLabel: Record<PropertyStatus, string> = {
  available: 'Disponível',
  rented: 'Alugado',
  repairing: 'Manutenção',
}

const statusBadgeClass: Record<PropertyStatus, string> = {
  available: 'available',
  rented: 'rented',
  repairing: 'maintenance',
}

function formatCurrency(value: string) {
  const num = Number(value)
  if (Number.isNaN(num)) return value
  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function filterProperty(row: Property, q: string) {
  return (
    row.code.toLowerCase().includes(q) ||
    row.address.street.toLowerCase().includes(q) ||
    row.address.neighborhood.toLowerCase().includes(q) ||
    row.address.city.toLowerCase().includes(q) ||
    statusLabel[row.status].toLowerCase().includes(q)
  )
}

interface PropertiesListContentProps {
  properties: Property[]
  categories: Category[]
  subcategories: Subcategory[]
}

export default function PropertiesListContent({
  properties: initialProperties,
  categories,
  subcategories,
}: PropertiesListContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [properties, setProperties] = useState(initialProperties)
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<PropertyFilters>({})
  const [isPending, startTransition] = useTransition()

  const hasActiveFilters = Object.keys(filters).length > 0

  const handleApplyFilters = useCallback((newFilters: PropertyFilters) => {
    setFilters(newFilters)
    startTransition(async () => {
      const hasFilters = Object.keys(newFilters).length > 0
      const result = hasFilters
        ? await fetchPropertiesAction(newFilters)
        : await fetchPropertiesAction()
      setProperties(result)
    })
  }, [])

  async function handleDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    const result = await deletePropertyAction(deleteTarget.id)
    setIsDeleting(false)
    setDeleteTarget(null)

    if (result.success) {
      setProperties((prev) => prev.filter((i) => i.id !== deleteTarget.id))
      toast({ variant: 'success', title: 'Imóvel excluído com sucesso.' })
    } else {
      toast({ variant: 'error', title: 'Erro ao excluir imóvel', description: result.error })
    }
  }

  const columns: RecordsColumn<Property>[] = [
    {
      id: 'code',
      header: 'Código',
      cell: (row) => (
        <button type="button" className="records-list-code">
          {row.code}
        </button>
      ),
    },
    {
      id: 'property',
      header: 'Imóvel',
      cell: (row) => (
        <div className="records-list-entity">
          <span className="records-list-entity-icon">
            <Building2 size={16} />
          </span>
          <span>
            <span className="records-list-entity-title">
              {row.address.street}{row.address.number ? `, ${row.address.number}` : ''}
            </span>
            <span className="records-list-entity-sub">
              {row.address.neighborhood}, {row.address.city}
            </span>
          </span>
        </div>
      ),
    },
    {
      id: 'amount',
      header: 'Aluguel',
      cell: (row) => (
        <span className="records-list-valor">
          {formatCurrency(row.rent_price)}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      align: 'center',
      cell: (row) => (
        <span className={`records-badge records-badge--${statusBadgeClass[row.status]}`}>
          {statusLabel[row.status]}
        </span>
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
            onClick: () => router.push(`/imoveis/editar/${row.id}`),
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
        entityName="imóveis"
        newButtonLabel="Novo imóvel"
        searchPlaceholder="Buscar imóvel, bairro ou cidade…"
        rows={properties}
        columns={columns}
        filterRow={filterProperty}
        getRowKey={(row) => row.id}
        tableLayout="properties"
        emptyMessage="Sem registros"
        onRowDoubleClick={(row) => router.push(`/imoveis/editar/${row.id}`)}
        onNewClick={() => router.push('/imoveis/novo')}
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

      <PropertiesFilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        categories={categories}
        subcategories={subcategories}
        currentFilters={filters}
        onApply={handleApplyFilters}
      />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        title="Excluir imóvel"
        description={`O imóvel "${deleteTarget?.code ?? ''}" será apagado permanentemente. Essa ação não pode ser desfeita.`}
        onConfirm={handleDelete}
      />
    </>
  )
}
