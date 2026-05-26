export type FormaRecebimento = 'boleto' | 'pix' | 'deposito' | 'cartao'

export interface ContratoCobrancaData {
  diaVencimento: number | ''
  formaRecebimento: FormaRecebimento
  banco: string
  agencia: string
  conta: string
  pixChave: string
  enviarBoletoEmail: boolean
  enviarLembreteVencimento: boolean
  agruparCobrancasMes: boolean
  observacoes: string
}

export const defaultContratoCobrancaData = (): ContratoCobrancaData => ({
  diaVencimento: 10,
  formaRecebimento: 'boleto',
  banco: '',
  agencia: '',
  conta: '',
  pixChave: '',
  enviarBoletoEmail: true,
  enviarLembreteVencimento: true,
  agruparCobrancasMes: true,
  observacoes: '',
})

export const FORMA_RECEBIMENTO_OPTIONS: {
  value: FormaRecebimento
  label: string
}[] = [
  { value: 'boleto', label: 'Boleto bancário' },
  { value: 'pix', label: 'PIX' },
  { value: 'deposito', label: 'Depósito / TED' },
  { value: 'cartao', label: 'Cartão (recorrente)' },
]

export function isContratoCobrancaValid(data: ContratoCobrancaData): boolean {
  if (typeof data.diaVencimento !== 'number') return false
  if (data.diaVencimento < 1 || data.diaVencimento > 31) return false
  return Boolean(data.formaRecebimento)
}
