export type ImovelStatus = 'disponivel' | 'alugado' | 'manutencao'
export type ImovelTipo = 'residencial' | 'comercial'

export interface Imovel {
  id: string
  codigo: string
  titulo: string
  bairro: string
  cidade: string
  tipo: ImovelTipo
  status: ImovelStatus
  valorAluguel: number
  proprietarioNome: string
}

export const mockImoveis: Imovel[] = [
  {
    id: 'im1',
    codigo: 'IMO-001',
    titulo: 'Apartamento 302 — Ed. Aurora',
    bairro: 'Jardins',
    cidade: 'São Paulo',
    tipo: 'residencial',
    status: 'alugado',
    valorAluguel: 4200,
    proprietarioNome: 'João Almeida',
  },
  {
    id: 'im2',
    codigo: 'IMO-002',
    titulo: 'Casa — Rua das Palmeiras',
    bairro: 'Vila Madalena',
    cidade: 'São Paulo',
    tipo: 'residencial',
    status: 'alugado',
    valorAluguel: 6800,
    proprietarioNome: 'Ana Paula Ribeiro',
  },
  {
    id: 'im3',
    codigo: 'IMO-003',
    titulo: 'Sala comercial 12',
    bairro: 'Centro',
    cidade: 'São Paulo',
    tipo: 'comercial',
    status: 'manutencao',
    valorAluguel: 3500,
    proprietarioNome: 'Imobiliária Horizonte',
  },
  {
    id: 'im4',
    codigo: 'IMO-004',
    titulo: 'Apartamento 51 — Res. Verde',
    bairro: 'Moema',
    cidade: 'São Paulo',
    tipo: 'residencial',
    status: 'disponivel',
    valorAluguel: 2900,
    proprietarioNome: 'Roberto Silva',
  },
  {
    id: 'im5',
    codigo: 'IMO-005',
    titulo: 'Loft — Av. Paulista',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    tipo: 'residencial',
    status: 'alugado',
    valorAluguel: 5500,
    proprietarioNome: 'Maria Oliveira',
  },
  {
    id: 'im6',
    codigo: 'IMO-006',
    titulo: 'Galpão logístico — Km 12',
    bairro: 'Capuava',
    cidade: 'Osasco',
    tipo: 'comercial',
    status: 'disponivel',
    valorAluguel: 12000,
    proprietarioNome: 'João Almeida',
  },
]
