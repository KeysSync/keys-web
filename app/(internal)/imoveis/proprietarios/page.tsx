'use client'

import { mockProprietarios, type Proprietario } from '@/lib/mocks/proprietarios'
import {
  CadastrosListView,
  type CadastrosColumn,
} from '@/app/components/CadastrosListView/CadastrosListView'

function filterProprietario(row: Proprietario, q: string) {
  return (
    row.nome.toLowerCase().includes(q) ||
    row.documento.toLowerCase().includes(q) ||
    row.email.toLowerCase().includes(q) ||
    row.telefone.toLowerCase().includes(q)
  )
}

const columns: CadastrosColumn<Proprietario>[] = [
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
]

export default function ImoveisProprietariosPage() {
  return (
    <CadastrosListView
      entityName="proprietários"
      newButtonLabel="Novo proprietário"
      searchPlaceholder="Buscar nome, documento ou e-mail…"
      rows={mockProprietarios}
      columns={columns}
      filterRow={filterProprietario}
      getRowKey={(row) => row.id}
      tableLayout="pessoas"
    />
  )
}
