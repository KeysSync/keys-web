export type ImovelStatus = 'disponivel' | 'alugado' | 'manutencao'
export type ImovelTipo = 'residencial' | 'comercial'

export interface Imovel {
  id: string
  codigo: string
  refSistema: string
  refImobiliaria: string
  logradouro: string
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
    refSistema: 'SYS-1001',
    refImobiliaria: 'REF-8842',
    logradouro: 'Alameda Santos, 1200 — Jardins',
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
    refSistema: 'SYS-1002',
    refImobiliaria: 'REF-9011',
    logradouro: 'Rua das Palmeiras, 88 — Vila Madalena',
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
    refSistema: 'SYS-1003',
    refImobiliaria: 'REF-7720',
    logradouro: 'Av. Paulista, 500 — Centro',
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
    refSistema: 'SYS-1004',
    refImobiliaria: 'REF-6654',
    logradouro: 'Rua Gaivota, 210 — Moema',
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
    refSistema: 'SYS-1005',
    refImobiliaria: 'REF-5588',
    logradouro: 'Av. Paulista, 1200 — Bela Vista',
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
    refSistema: 'SYS-1006',
    refImobiliaria: 'REF-4412',
    logradouro: 'Rod. Anhanguera, Km 12 — Capuava',
    titulo: 'Galpão logístico — Km 12',
    bairro: 'Capuava',
    cidade: 'Osasco',
    tipo: 'comercial',
    status: 'disponivel',
    valorAluguel: 12000,
    proprietarioNome: 'João Almeida',
  },
]
