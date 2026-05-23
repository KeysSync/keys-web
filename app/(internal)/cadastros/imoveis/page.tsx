'use client'

import { Building2 } from 'lucide-react'
import {
  mockImoveis,
  type Imovel,
  type ImovelStatus,
  type ImovelTipo,
} from '@/lib/mocks/imoveis'
import {
  CadastrosListView,
  type CadastrosColumn,
} from '../components/CadastrosListView'

const statusLabel: Record<ImovelStatus, string> = {
  disponivel: 'Disponível',
  alugado: 'Alugado',
  manutencao: 'Manutenção',
}

const tipoLabel: Record<ImovelTipo, string> = {
  residencial: 'Residencial',
  comercial: 'Comercial',
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function filterImovel(row: Imovel, q: string) {
  return (
    row.codigo.toLowerCase().includes(q) ||
    row.titulo.toLowerCase().includes(q) ||
    row.bairro.toLowerCase().includes(q) ||
    row.cidade.toLowerCase().includes(q) ||
    row.proprietarioNome.toLowerCase().includes(q) ||
    statusLabel[row.status].toLowerCase().includes(q) ||
    tipoLabel[row.tipo].toLowerCase().includes(q)
  )
}

const columns: CadastrosColumn<Imovel>[] = [
  {
    id: 'codigo',
    header: 'Código',
    cell: (row) => (
      <button type="button" className="cadastros-list-code">
        {row.codigo}
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
          <span className="cadastros-list-entity-title">{row.titulo}</span>
          <span className="cadastros-list-entity-sub">
            {row.bairro}, {row.cidade}
          </span>
        </span>
      </div>
    ),
  },
  {
    id: 'tipo',
    header: 'Tipo',
    cell: (row) => tipoLabel[row.tipo],
  },
  {
    id: 'valor',
    header: 'Aluguel',
    cell: (row) => (
      <span className="cadastros-list-valor">{formatCurrency(row.valorAluguel)}</span>
    ),
  },
  {
    id: 'proprietario',
    header: 'Proprietário',
    cell: (row) => row.proprietarioNome,
  },
  {
    id: 'status',
    header: 'Status',
    align: 'center',
    cell: (row) => (
      <span className={`cadastros-badge cadastros-badge--${row.status}`}>
        {statusLabel[row.status]}
      </span>
    ),
  },
]

export default function CadastrosImoveisPage() {
  return (
    <CadastrosListView
      entityName="imóveis"
      newButtonLabel="Novo imóvel"
      searchPlaceholder="Buscar imóvel, bairro ou proprietário…"
      rows={mockImoveis}
      columns={columns}
      filterRow={filterImovel}
      getRowKey={(row) => row.id}
      tableLayout="imoveis"
    />
  )
}
