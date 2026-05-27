'use client'

import {
  CadastrosListView,
  type CadastrosColumn,
} from '@/app/components/CadastrosListView/CadastrosListView'
import { DeleteConfirmDialog } from '@/app/components/DeleteConfirmDialog/DeleteConfirmDialog'
import '@/app/components/DeleteConfirmDialog/delete-confirm.css'
import {
  RowActionsMenu,
  type RowAction,
} from '@/app/components/RowActionsMenu/RowActionsMenu'
import '@/app/components/RowActionsMenu/row-actions.css'
import { InquilinosFilterDialog } from '@/app/components/InquilinosFilterDialog/InquilinosFilterDialog'
import {
  deleteInquilinoAction,
  fetchInquilinosAction,
} from '@/lib/inquilinos/actions'
import type { InquilinoListRow, InquilinoUserFilters } from '@/lib/inquilinos/api'
import { useToast } from '@/lib/toast/use-toast'
import { Filter, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'

function filterInquilino(row: InquilinoListRow, q: string) {
  return (
    row.nome.toLowerCase().includes(q) ||
    row.documento.toLowerCase().includes(q) ||
    row.email.toLowerCase().includes(q) ||
    row.telefone.toLowerCase().includes(q)
  )
}

interface InquilinosListContentProps {
  inquilinos: InquilinoListRow[]
}

export default function InquilinosListContent({
  inquilinos: initialRows,
}: InquilinosListContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [inquilinos, setInquilinos] = useState(initialRows)
  const [deleteTarget, setDeleteTarget] = useState<InquilinoListRow | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<InquilinoUserFilters>({})
  const [isPending, startTransition] = useTransition()

  const hasActiveFilters = Object.keys(filters).length > 0

  const handleApplyFilters = useCallback((newFilters: InquilinoUserFilters) => {
    setFilters(newFilters)
    startTransition(async () => {
      const hasFilters = Object.keys(newFilters).length > 0
      const result = hasFilters
        ? await fetchInquilinosAction(newFilters)
        : await fetchInquilinosAction()
      setInquilinos(result)
    })
  }, [])

  async function handleDelete() {
    if (!deleteTarget) return
    const id = deleteTarget.id
    const result = await deleteInquilinoAction(id)
    setDeleteTarget(null)

    if (result.success) {
      setInquilinos((prev) => prev.filter((row) => row.id !== id))
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

  const columns: CadastrosColumn<InquilinoListRow>[] = [
    {
      id: 'nome',
      header: 'Nome',
      cell: (row) => (
        <div>
          <span className="cadastros-list-strong">{row.nome}</span>
          <span className="cadastros-list-entity-sub">{row.documento}</span>
        </div>
      ),
    },
    {
      id: 'tipo',
      header: 'Tipo',
      align: 'center',
      cell: (row) => (
        <span className={`cadastros-badge cadastros-badge--tipo-${row.tipo}`}>
          {row.tipo === 'pf' ? 'PF' : 'PJ'}
        </span>
      ),
    },
    {
      id: 'email',
      header: 'E-mail',
      cell: (row) => row.email,
    },
    {
      id: 'telefone',
      header: 'Telefone',
      cell: (row) => row.telefone,
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
      <CadastrosListView
        entityName="inquilinos"
        newButtonLabel="Novo inquilino"
        searchPlaceholder="Buscar nome, documento ou e-mail…"
        rows={inquilinos}
        columns={columns}
        filterRow={filterInquilino}
        getRowKey={(row) => row.id}
        tableLayout="pessoas"
        emptyMessage="Sem registros"
        onRowDoubleClick={(row) =>
          router.push(`/locacao/inquilinos/editar/${row.id}`)
        }
        onNewClick={() => router.push('/locacao/inquilinos/novo')}
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

      <InquilinosFilterDialog
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
        description={`O inquilino "${deleteTarget?.nome ?? ''}" será apagado permanentemente. Essa ação não pode ser desfeita.`}
        onConfirm={handleDelete}
      />
    </>
  )
}
