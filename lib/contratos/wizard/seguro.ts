export type SeguroResponsavelPagamento = 'locador' | 'locatario' | 'imobiliaria'

export type TipoSeguro =
  | 'incendio'
  | 'fianca_locaticia'
  | 'responsabilidade_civil'
  | 'conteudo_patrimonio'
  | 'multirrisco'
  | 'vida'
  | 'danos_eletricos'
  | 'outro'

export interface ContratoSeguroItem {
  id: string
  tipo: TipoSeguro
  seguradora: string
  apolice: string
  coberturaValor: number | ''
  premioMensal: number | ''
  vigenciaInicio: string
  vigenciaFim: string
  responsavelPagamento: SeguroResponsavelPagamento
  observacoes: string
}

/** Formato antigo do draft (apenas incêndio). */
export interface ContratoSeguroLegadoData {
  contratado: boolean
  seguradora: string
  apolice: string
  coberturaValor: number | ''
  vigenciaInicio: string
  vigenciaFim: string
  premioMensal: number | ''
  responsavelPagamento: SeguroResponsavelPagamento
  observacoes: string
}

export interface ContratoSegurosData {
  tipoMenu: TipoSeguro
  itens: ContratoSeguroItem[]
  /** rascunho do formulário do submenu ativo */
  rascunho: Omit<ContratoSeguroItem, 'id' | 'tipo'>
}

export const TIPO_SEGURO_OPTIONS: {
  value: TipoSeguro
  label: string
  descricao: string
}[] = [
  {
    value: 'incendio',
    label: 'Incêndio',
    descricao: 'Cobertura contra incêndio, explosão e fumaça no imóvel.',
  },
  {
    value: 'fianca_locaticia',
    label: 'Fiança locatícia',
    descricao: 'Apólice que garante o pagamento do aluguel ao proprietário.',
  },
  {
    value: 'responsabilidade_civil',
    label: 'Resp. civil',
    descricao: 'Danos causados a terceiros no uso do imóvel.',
  },
  {
    value: 'conteudo_patrimonio',
    label: 'Conteúdo',
    descricao: 'Bens e pertences do locatário dentro do imóvel.',
  },
  {
    value: 'multirrisco',
    label: 'Multirrisco',
    descricao: 'Pacote combinado para o imóvel (incêndio, danos elétricos, etc.).',
  },
  {
    value: 'vida',
    label: 'Vida',
    descricao: 'Seguro de vida vinculado à locação, quando exigido.',
  },
  {
    value: 'danos_eletricos',
    label: 'Danos elétricos',
    descricao: 'Queima de equipamentos por variação de energia.',
  },
  {
    value: 'outro',
    label: 'Outro',
    descricao: 'Demais modalidades não listadas acima.',
  },
]

export const SEGURO_RESPONSAVEL_OPTIONS: {
  value: SeguroResponsavelPagamento
  label: string
}[] = [
  { value: 'locatario', label: 'Locatário' },
  { value: 'locador', label: 'Proprietário' },
  { value: 'imobiliaria', label: 'Imobiliária' },
]

const emptyRascunho = (): ContratoSegurosData['rascunho'] => ({
  seguradora: '',
  apolice: '',
  coberturaValor: '',
  premioMensal: '',
  vigenciaInicio: '',
  vigenciaFim: '',
  responsavelPagamento: 'locatario',
  observacoes: '',
})

export const defaultContratoSegurosData = (): ContratoSegurosData => ({
  tipoMenu: 'incendio',
  itens: [],
  rascunho: emptyRascunho(),
})

/** Compatível com draft antigo (único seguro incêndio). */
export function normalizeContratoSegurosData(
  raw:
    | Partial<ContratoSegurosData>
    | Partial<ContratoSeguroLegadoData>
    | undefined,
): ContratoSegurosData {
  const base = defaultContratoSegurosData()
  if (!raw) return base

  if ('itens' in raw && Array.isArray(raw.itens)) {
    return {
      ...base,
      ...raw,
      itens: raw.itens,
      rascunho: { ...emptyRascunho(), ...raw.rascunho },
    }
  }

  const legado = raw as Partial<ContratoSeguroLegadoData>
  if (legado.contratado === false) return base

  if (
    legado.seguradora ||
    legado.apolice ||
    legado.coberturaValor ||
    legado.premioMensal
  ) {
    return {
      tipoMenu: 'incendio',
      itens: [
        {
          id: `sg-legado-${Date.now()}`,
          tipo: 'incendio',
          seguradora: legado.seguradora ?? '',
          apolice: legado.apolice ?? '',
          coberturaValor: legado.coberturaValor ?? '',
          premioMensal: legado.premioMensal ?? '',
          vigenciaInicio: legado.vigenciaInicio ?? '',
          vigenciaFim: legado.vigenciaFim ?? '',
          responsavelPagamento: legado.responsavelPagamento ?? 'locatario',
          observacoes: legado.observacoes ?? '',
        },
      ],
      rascunho: emptyRascunho(),
    }
  }

  return base
}

export function createSeguroItem(
  tipo: TipoSeguro,
  rascunho: ContratoSegurosData['rascunho'],
): ContratoSeguroItem {
  return {
    id: `sg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    tipo,
    ...rascunho,
  }
}

export function getTipoSeguroLabel(tipo: TipoSeguro) {
  return TIPO_SEGURO_OPTIONS.find((o) => o.value === tipo)?.label ?? tipo
}

/** Alias para compatibilidade com imports existentes. */
export const defaultContratoSeguroData = defaultContratoSegurosData
export type ContratoSeguroData = ContratoSegurosData
