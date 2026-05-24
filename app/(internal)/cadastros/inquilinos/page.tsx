'use client'

import {
  mockInquilinos,
  type Inquilino,
  type InquilinoContratoStatus,
} from '@/lib/mocks/inquilinos'
import {
  CadastrosListView,
  type CadastrosColumn,
} from '@/app/components/CadastrosListView/CadastrosListView'

const contratoStatusLabel: Record<InquilinoContratoStatus, string> = {
  ativo: 'Contrato ativo',
  pendente: 'Contrato pendente',
  sem_contrato: 'Sem contrato',
}

function filterInquilino(row: Inquilino, q: string) {
  return (
    row.nome.toLowerCase().includes(q) ||
    row.documento.toLowerCase().includes(q) ||
    row.email.toLowerCase().includes(q) ||
    row.telefone.toLowerCase().includes(q) ||
    (row.contratoCodigo?.toLowerCase().includes(q) ?? false) ||
    contratoStatusLabel[row.statusContrato].toLowerCase().includes(q)
  )
}

const columns: CadastrosColumn<Inquilino>[] = [
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
    id: 'contrato',
    header: 'Contrato',
    cell: (row) =>
      row.contratoCodigo ? (
        <button type="button" className="cadastros-list-code">
          {row.contratoCodigo}
        </button>
      ) : (
        <span className="cadastros-list-muted">—</span>
      ),
  },
  {
    id: 'status',
    header: 'Situação',
    align: 'center',
    cell: (row) => (
      <span
        className={`cadastros-badge cadastros-badge--contrato-${row.statusContrato}`}
      >
        {contratoStatusLabel[row.statusContrato]}
      </span>
    ),
  },
]

export default function CadastrosInquilinosPage() {
  return (
    <CadastrosListView
      entityName="inquilinos"
      newButtonLabel="Novo inquilino"
      searchPlaceholder="Buscar nome, documento ou contrato…"
      rows={mockInquilinos}
      columns={columns}
      filterRow={filterInquilino}
      getRowKey={(row) => row.id}
      tableLayout="pessoas"
    />
  )
}
