'use client'

import {
  CadastrosListView,
  type CadastrosColumn,
} from '@/app/components/CadastrosListView/CadastrosListView'
import '@/app/components/DeleteConfirmDialog/delete-confirm.css'
import { DeleteConfirmDialog } from '@/app/components/DeleteConfirmDialog/DeleteConfirmDialog'
import '@/app/components/RowActionsMenu/row-actions.css'
import {
  RowActionsMenu,
  type RowAction,
} from '@/app/components/RowActionsMenu/RowActionsMenu'
import type { Imovel, ImovelStatus } from '@/lib/imoveis/api'
import { Building2, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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

export default function ImoveisListContent({ imoveis }: { imoveis: Imovel[] }) {
  const router = useRouter()
  const [deleteTarget, setDeleteTarget] = useState<Imovel | null>(null)

  function handleDelete() {
    if (!deleteTarget) return
    setDeleteTarget(null)
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
