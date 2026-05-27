'use client'

import {
  CadastrosListView,
  type CadastrosColumn,
} from '@/app/components/CadastrosListView/CadastrosListView'
import '@/app/components/DeleteConfirmDialog/delete-confirm.css'
import { DeleteConfirmDialog } from '@/app/components/DeleteConfirmDialog/DeleteConfirmDialog'
import { ImoveisFilterDialog } from '@/app/components/ImoveisFilterDialog/ImoveisFilterDialog'
import '@/app/components/RowActionsMenu/row-actions.css'
import {
  RowActionsMenu,
  type RowAction,
} from '@/app/components/RowActionsMenu/RowActionsMenu'
import type { Category, Imovel, ImovelFilters, ImovelStatus, Subcategory } from '@/lib/imoveis/api'
import { deleteImovelAction, fetchImoveisAction } from '@/lib/imoveis/actions'
import { useToast } from '@/lib/toast/use-toast'
import { Building2, Filter, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'

const statusLabel: Record<ImovelStatus, string> = {
  available: 'Disponível',
  rented: 'Alugado',
  repairing: 'Manutenção',
}

const statusBadgeClass: Record<ImovelStatus, string> = {
  available: 'disponivel',
  rented: 'alugado',
  repairing: 'manutencao',
}

function formatCurrency(value: string) {
  const num = Number(value)
  if (Number.isNaN(num)) return value
  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function filterImovel(row: Imovel, q: string) {
  return (
    row.code.toLowerCase().includes(q) ||
    row.address.street.toLowerCase().includes(q) ||
    row.address.neighborhood.toLowerCase().includes(q) ||
    row.address.city.toLowerCase().includes(q) ||
    statusLabel[row.status].toLowerCase().includes(q)
  )
}

interface ImoveisListContentProps {
  imoveis: Imovel[]
  categories: Category[]
  subcategories: Subcategory[]
}

export default function ImoveisListContent({
  imoveis: initialImoveis,
  categories,
  subcategories,
}: ImoveisListContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [imoveis, setImoveis] = useState(initialImoveis)
  const [deleteTarget, setDeleteTarget] = useState<Imovel | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<ImovelFilters>({})
  const [isPending, startTransition] = useTransition()

  const hasActiveFilters = Object.keys(filters).length > 0

  const handleApplyFilters = useCallback((newFilters: ImovelFilters) => {
    setFilters(newFilters)
    startTransition(async () => {
      const hasFilters = Object.keys(newFilters).length > 0
      const result = hasFilters
        ? await fetchImoveisAction(newFilters)
        : await fetchImoveisAction()
      setImoveis(result)
    })
  }, [])

  async function handleDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    const result = await deleteImovelAction(deleteTarget.id)
    setIsDeleting(false)
    setDeleteTarget(null)

    if (result.success) {
      setImoveis((prev) => prev.filter((i) => i.id !== deleteTarget.id))
      toast({ variant: 'success', title: 'Imóvel excluído com sucesso.' })
    } else {
      toast({ variant: 'error', title: 'Erro ao excluir imóvel', description: result.error })
    }
  }

  const columns: CadastrosColumn<Imovel>[] = [
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
      id: 'imovel',
      header: 'Imóvel',
      cell: (row) => (
        <div className="cadastros-list-entity">
          <span className="cadastros-list-entity-icon">
            <Building2 size={16} />
          </span>
          <span>
            <span className="cadastros-list-entity-title">
              {row.address.street}{row.address.number ? `, ${row.address.number}` : ''}
            </span>
            <span className="cadastros-list-entity-sub">
              {row.address.neighborhood}, {row.address.city}
            </span>
          </span>
        </div>
      ),
    },
    {
      id: 'valor',
      header: 'Aluguel',
      cell: (row) => (
        <span className="cadastros-list-valor">
          {formatCurrency(row.rent_price)}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      align: 'center',
      cell: (row) => (
        <span className={`cadastros-badge cadastros-badge--${statusBadgeClass[row.status]}`}>
          {statusLabel[row.status]}
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
      <CadastrosListView
        entityName="imóveis"
        newButtonLabel="Novo imóvel"
        searchPlaceholder="Buscar imóvel, bairro ou cidade…"
        rows={imoveis}
        columns={columns}
        filterRow={filterImovel}
        getRowKey={(row) => row.id}
        tableLayout="imoveis"
        emptyMessage="Sem registros"
        onRowDoubleClick={(row) => router.push(`/imoveis/editar/${row.id}`)}
        onNewClick={() => router.push('/imoveis/novo')}
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

      <ImoveisFilterDialog
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
