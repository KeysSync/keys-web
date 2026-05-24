export type ContratoTipo = 'residencial' | 'comercial' | 'temporada'

export type FormaCobranca = 'vencimento' | 'fixo' | 'antecipado'

export type IndiceReajuste = 'igpm' | 'ipca' | 'inpc' | 'percentual_fixo'

export type ComissaoPrimeiroAluguel = 'nao_tem' | 'percentual' | 'valor_fixo'

export type TaxaAdmModo = 'percentual' | 'valor'

export type DescontoPontualidadeModo =
  | 'percentual'
  | 'percentual_aluguel'
  | 'valor'

export interface ContratoGeralData {
  tipoContrato: ContratoTipo | ''
  inicioContrato: string
  duracaoMeses: number | ''
  fimContrato: string
  renovacaoAutomatica: boolean
  duracaoBaseMeses: number | ''
  assinaturaContrato: string
  entregaChaves: string
  primeiroVencimentoDe: string
  formaCobranca: FormaCobranca | ''
  multaPercentual: number | ''
  jurosPercentualMensal: number | ''
  calcularMultaJurosAutomatico: boolean
  codigoInterno: string

  mesBaseReajuste: string
  indiceReajusteAnual: IndiceReajuste | ''
  proximoReajuste: string
  gerarFinanceiroDe: string
  valorAluguel: number | ''
  aluguelGarantido: boolean
  aluguelGarantidoDuracaoMeses: number | ''
  taxaAdmModo: TaxaAdmModo
  taxaAdmValor: number | ''
  descontoPontualidadeModo: DescontoPontualidadeModo
  descontoPontualidadeValor: number | ''
  aluguelProporcional: number | ''

  comissaoPrimeiroAluguel: ComissaoPrimeiroAluguel
  comissaoValor: number | ''
  comissaoParceladoEm: number | ''
  comissaoLancarMes: string

  possuiMultaRescisao: boolean
  valorMultaRescisao: number | ''
  isentarMultaAposMeses: number | ''

  utilitariosAgua: boolean
  utilitariosEnergia: boolean
  utilitariosGas: boolean
}

export const defaultContratoGeralData = (): ContratoGeralData => ({
  tipoContrato: '',
  inicioContrato: '',
  duracaoMeses: 12,
  fimContrato: '',
  renovacaoAutomatica: false,
  duracaoBaseMeses: 12,
  assinaturaContrato: '',
  entregaChaves: '',
  primeiroVencimentoDe: '',
  formaCobranca: 'vencimento',
  multaPercentual: 10,
  jurosPercentualMensal: 1,
  calcularMultaJurosAutomatico: true,
  codigoInterno: '',

  mesBaseReajuste: '',
  indiceReajusteAnual: 'igpm',
  proximoReajuste: '',
  gerarFinanceiroDe: '',
  valorAluguel: '',
  aluguelGarantido: false,
  aluguelGarantidoDuracaoMeses: 12,
  taxaAdmModo: 'percentual',
  taxaAdmValor: 10,
  descontoPontualidadeModo: 'percentual',
  descontoPontualidadeValor: '',
  aluguelProporcional: '',

  comissaoPrimeiroAluguel: 'nao_tem',
  comissaoValor: '',
  comissaoParceladoEm: 1,
  comissaoLancarMes: '',

  possuiMultaRescisao: false,
  valorMultaRescisao: '',
  isentarMultaAposMeses: '',

  utilitariosAgua: false,
  utilitariosEnergia: false,
  utilitariosGas: false,
})

export function addMonthsToIsoDate(isoDate: string, months: number): string {
  if (!isoDate || !months) return ''
  const date = new Date(`${isoDate}T12:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  date.setMonth(date.getMonth() + months)
  return date.toISOString().slice(0, 10)
}

export function isContratoGeralValid(data: ContratoGeralData): boolean {
  return (
    Boolean(data.tipoContrato) &&
    Boolean(data.inicioContrato) &&
    typeof data.duracaoMeses === 'number' &&
    data.duracaoMeses > 0 &&
    Boolean(data.formaCobranca) &&
    typeof data.valorAluguel === 'number' &&
    data.valorAluguel > 0
  )
}

export const CONTRATO_TIPO_OPTIONS: { value: ContratoTipo; label: string }[] = [
  { value: 'residencial', label: 'Residencial' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'temporada', label: 'Temporada' },
]

export const FORMA_COBRANCA_OPTIONS: { value: FormaCobranca; label: string }[] = [
  { value: 'vencimento', label: 'Vencimento' },
  { value: 'fixo', label: 'Dia fixo' },
  { value: 'antecipado', label: 'Antecipado' },
]

export const INDICE_REAJUSTE_OPTIONS: { value: IndiceReajuste; label: string }[] = [
  { value: 'igpm', label: 'IGP-M' },
  { value: 'ipca', label: 'IPCA' },
  { value: 'inpc', label: 'INPC' },
  { value: 'percentual_fixo', label: 'Percentual fixo' },
]

export const COMISSAO_OPTIONS: {
  value: ComissaoPrimeiroAluguel
  label: string
}[] = [
  { value: 'nao_tem', label: 'Não tem' },
  { value: 'percentual', label: 'Percentual' },
  { value: 'valor_fixo', label: 'Valor fixo' },
]

export const MESES_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1).padStart(2, '0'),
}))

export const PARCELAS_OPTIONS = [1, 2, 3, 4, 5, 6, 12].map((n) => ({
  value: String(n),
  label: `${n}x`,
}))
