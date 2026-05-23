export type PessoaTipo = 'pf' | 'pj'

export type InquilinoContratoStatus = 'ativo' | 'pendente' | 'sem_contrato'

export interface Inquilino {
  id: string
  nome: string
  documento: string
  tipo: PessoaTipo
  email: string
  telefone: string
  contratoCodigo: string | null
  statusContrato: InquilinoContratoStatus
}

export const mockInquilinos: Inquilino[] = [
  {
    id: 'iq1',
    nome: 'Mariana Costa',
    documento: '111.222.333-44',
    tipo: 'pf',
    email: 'mariana.costa@email.com',
    telefone: '(11) 98111-2233',
    contratoCodigo: 'CTR-2024-001',
    statusContrato: 'ativo',
  },
  {
    id: 'iq2',
    nome: 'Pedro Henrique Lima',
    documento: '555.666.777-88',
    tipo: 'pf',
    email: 'pedro.lima@email.com',
    telefone: '(11) 98222-3344',
    contratoCodigo: 'CTR-2024-002',
    statusContrato: 'ativo',
  },
  {
    id: 'iq3',
    nome: 'Tech Solutions Ltda',
    documento: '98.765.432/0001-10',
    tipo: 'pj',
    email: 'financeiro@techsolutions.com.br',
    telefone: '(11) 3333-4444',
    contratoCodigo: 'CTR-2024-003',
    statusContrato: 'pendente',
  },
  {
    id: 'iq4',
    nome: 'Carla Mendes',
    documento: '999.888.777-66',
    tipo: 'pf',
    email: 'carla.mendes@email.com',
    telefone: '(11) 98333-4455',
    contratoCodigo: 'CTR-2023-018',
    statusContrato: 'sem_contrato',
  },
  {
    id: 'iq5',
    nome: 'Lucas Ferreira',
    documento: '444.333.222-11',
    tipo: 'pf',
    email: 'lucas.ferreira@email.com',
    telefone: '(11) 98444-5566',
    contratoCodigo: 'CTR-2024-004',
    statusContrato: 'ativo',
  },
  {
    id: 'iq6',
    nome: 'Beatriz Nunes',
    documento: '777.888.999-00',
    tipo: 'pf',
    email: 'beatriz.nunes@email.com',
    telefone: '(11) 98555-6677',
    contratoCodigo: null,
    statusContrato: 'sem_contrato',
  },
]
