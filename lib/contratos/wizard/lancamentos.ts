export type LancamentoTipo =
  | 'aluguel'
  | 'condominio'
  | 'iptu'
  | 'agua'
  | 'energia'
  | 'gas'
  | 'taxa_adm'
  | 'outro'

export type LancamentoResponsavel = 'locatario' | 'proprietario' | 'imobiliaria'

export interface ContratoLancamentoItem {
  id: string
  tipo: LancamentoTipo
  descricao: string
  valor: number | ''
  responsavel: LancamentoResponsavel
  recorrente: boolean
}

export interface ContratoLancamentosData {
  itens: ContratoLancamentoItem[]
}

export const defaultContratoLancamentosData = (): ContratoLancamentosData => ({
  itens: [],
})

export const LANCAMENTO_TIPO_OPTIONS: { value: LancamentoTipo; label: string }[] = [
  { value: 'aluguel', label: 'Aluguel' },
  { value: 'condominio', label: 'Condomínio' },
  { value: 'iptu', label: 'IPTU' },
  { value: 'agua', label: 'Água' },
  { value: 'energia', label: 'Energia' },
  { value: 'gas', label: 'Gás' },
  { value: 'taxa_adm', label: 'Taxa de administração' },
  { value: 'outro', label: 'Outro' },
]

export const LANCAMENTO_RESPONSAVEL_OPTIONS: {
  value: LancamentoResponsavel
  label: string
}[] = [
  { value: 'locatario', label: 'Locatário' },
  { value: 'proprietario', label: 'Proprietário' },
  { value: 'imobiliaria', label: 'Imobiliária' },
]

export function createLancamentoItem(
  partial?: Partial<ContratoLancamentoItem>,
): ContratoLancamentoItem {
  return {
    id: `lc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    tipo: 'outro',
    descricao: '',
    valor: '',
    responsavel: 'locatario',
    recorrente: true,
    ...partial,
  }
}
