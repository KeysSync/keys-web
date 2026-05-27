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
import { deleteProprietarioAction } from '@/lib/proprietarios/actions'
import type { ProprietarioListRow } from '@/lib/proprietarios/types'
import { useToast } from '@/lib/toast/use-toast'
import { Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function filterProprietario(row: ProprietarioListRow, q: string) {
  return (
    row.nome.toLowerCase().includes(q) ||
    row.documento.toLowerCase().includes(q) ||
    row.email.toLowerCase().includes(q) ||
    row.telefone.toLowerCase().includes(q)
  )
}

interface ProprietariosListContentProps {
  proprietarios: ProprietarioListRow[]
}

export default function ProprietariosListContent({
  proprietarios: initialRows,
}: ProprietariosListContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [proprietarios, setProprietarios] = useState(initialRows)
  console.log('[ProprietariosList] rows:', proprietarios)
  const [deleteTarget, setDeleteTarget] = useState<ProprietarioListRow | null>(
    null,
  )

  async function handleDelete() {
    if (!deleteTarget) return
    const id = deleteTarget.id
    const result = await deleteProprietarioAction(id)
    setDeleteTarget(null)

    if (result.success) {
      setProprietarios((prev) => prev.filter((p) => p.id !== id))
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

  const columns: CadastrosColumn<ProprietarioListRow>[] = [
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
      id: 'imoveis',
      header: 'Imóveis',
      align: 'center',
      cell: (row) => (
        <span className="cadastros-list-num">{row.qtdImoveis}</span>
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
      <CadastrosListView
        entityName="proprietários"
        newButtonLabel="Novo proprietário"
        searchPlaceholder="Buscar nome, documento ou e-mail…"
        rows={proprietarios}
        columns={columns}
        filterRow={filterProprietario}
        getRowKey={(row) => row.id}
        tableLayout="pessoas"
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
        description={`O proprietário "${deleteTarget?.nome ?? ''}" será apagado permanentemente. Essa ação não pode ser desfeita.`}
        onConfirm={handleDelete}
      />
    </>
  )
}
