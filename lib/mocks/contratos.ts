export type ContratoStatus = 'ativo' | 'pendente' | 'rescindido'

export interface Contrato {
  id: string
  codigo: string
  imovelTitulo: string
  imovelBairro: string
  inquilino: string
  proprietario: string
  valorMensal: number
  inicio: string
  fim: string | null
  status: ContratoStatus
}

/** Contratos fake para desenvolvimento. */
export const mockContratos: Contrato[] = [
  {
    id: 'c1',
    codigo: 'CTR-2024-001',
    imovelTitulo: 'Apartamento 302 — Ed. Aurora',
    imovelBairro: 'Jardins',
    inquilino: 'Mariana Costa',
    proprietario: 'João Almeida',
    valorMensal: 4200,
    inicio: '2024-03-01',
    fim: '2025-02-28',
    status: 'ativo',
  },
  {
    id: 'c2',
    codigo: 'CTR-2024-002',
    imovelTitulo: 'Casa — Rua das Palmeiras',
    imovelBairro: 'Vila Madalena',
    inquilino: 'Pedro Henrique Lima',
    proprietario: 'Ana Paula Ribeiro',
    valorMensal: 6800,
    inicio: '2024-01-15',
    fim: '2025-01-14',
    status: 'ativo',
  },
  {
    id: 'c3',
    codigo: 'CTR-2024-003',
    imovelTitulo: 'Sala comercial 12',
    imovelBairro: 'Centro',
    inquilino: 'Tech Solutions Ltda',
    proprietario: 'Imobiliária Horizonte',
    valorMensal: 3500,
    inicio: '2024-06-01',
    fim: null,
    status: 'pendente',
  },
  {
    id: 'c4',
    codigo: 'CTR-2023-018',
    imovelTitulo: 'Apartamento 51 — Res. Verde',
    imovelBairro: 'Moema',
    inquilino: 'Carla Mendes',
    proprietario: 'Roberto Silva',
    valorMensal: 2900,
    inicio: '2023-08-01',
    fim: '2024-07-31',
    status: 'rescindido',
  },
  {
    id: 'c5',
    codigo: 'CTR-2024-004',
    imovelTitulo: 'Loft — Av. Paulista',
    imovelBairro: 'Bela Vista',
    inquilino: 'Lucas Ferreira',
    proprietario: 'Maria Oliveira',
    valorMensal: 5500,
    inicio: '2024-09-01',
    fim: '2025-08-31',
    status: 'ativo',
  },
]
