export type PaymentMethod = 'boleto' | 'pix' | 'bankTransfer' | 'cartao'

export interface ContractBillingData {
  dueDay: number | ''
  paymentMethod: PaymentMethod
  banco: string
  agencia: string
  conta: string
  pixKey: string
  sendInvoiceEmail: boolean
  sendDueReminder: boolean
  groupMonthlyCharges: boolean
  notes: string
}

export const defaultContractBillingData = (): ContractBillingData => ({
  dueDay: 10,
  paymentMethod: 'boleto',
  banco: '',
  agencia: '',
  conta: '',
  pixKey: '',
  sendInvoiceEmail: true,
  sendDueReminder: true,
  groupMonthlyCharges: true,
  notes: '',
})

export const PAYMENT_METHOD_OPTIONS: {
  value: PaymentMethod
  label: string
}[] = [
  { value: 'boleto', label: 'Boleto bancário' },
  { value: 'pix', label: 'PIX' },
  { value: 'bankTransfer', label: 'Depósito / TED' },
  { value: 'cartao', label: 'Cartão (recorrente)' },
]

export function isContractBillingValid(data: ContractBillingData): boolean {
  if (typeof data.dueDay !== 'number') return false
  if (data.dueDay < 1 || data.dueDay > 31) return false
  return Boolean(data.paymentMethod)
}
