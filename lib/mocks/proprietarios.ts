import type { ProprietarioListRow } from '@/lib/proprietarios/types'

export type PessoaTipo = ProprietarioListRow['tipo']
export type Proprietario = ProprietarioListRow

export const mockProprietarios: ProprietarioListRow[] = [
  {
    id: 'pr1',
    nome: 'João Almeida',
    documento: '123.456.789-00',
    tipo: 'pf',
    email: 'joao.almeida@email.com',
    telefone: '(11) 98765-4321',
    qtdImoveis: 2,
  },
  {
    id: 'pr2',
    nome: 'Ana Paula Ribeiro',
    documento: '987.654.321-00',
    tipo: 'pf',
    email: 'ana.ribeiro@email.com',
    telefone: '(11) 91234-5678',
    qtdImoveis: 1,
  },
  {
    id: 'pr3',
    nome: 'Imobiliária Horizonte',
    documento: '12.345.678/0001-90',
    tipo: 'pj',
    email: 'contato@horizonte.com.br',
    telefone: '(11) 4002-8922',
    qtdImoveis: 1,
  },
  {
    id: 'pr4',
    nome: 'Roberto Silva',
    documento: '456.789.123-00',
    tipo: 'pf',
    email: 'roberto.silva@email.com',
    telefone: '(11) 99876-5432',
    qtdImoveis: 1,
  },
  {
    id: 'pr5',
    nome: 'Maria Oliveira',
    documento: '321.654.987-00',
    tipo: 'pf',
    email: 'maria.oliveira@email.com',
    telefone: '(11) 97654-3210',
    qtdImoveis: 1,
  },
]
