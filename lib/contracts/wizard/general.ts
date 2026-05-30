export type ContractType = 'residential' | 'commercial' | 'seasonal'

export type BillingSchedule = 'dueDate' | 'fixedDay' | 'prepaid'

export type AdjustmentIndex = 'igpm' | 'ipca' | 'inpc' | 'fixedPercent'

export type FirstRentCommissionMode = 'none' | 'percentual' | 'fixedAmount'

export type AdminFeeMode = 'percentual' | 'fixedAmount'

export type OnTimeDiscountMode =
  | 'percentual'
  | 'rentPercent'
  | 'fixedAmount'

export interface ContractGeneralData {
  contractType: ContractType | ''
  contractStartDate: string
  durationMonths: number | ''
  contractEndDate: string
  autoRenewal: boolean
  baseDurationMonths: number | ''
  contractSigningDate: string
  keyHandoverDate: string
  firstDueDateFrom: string
  billingSchedule: BillingSchedule | ''
  penaltyPercent: number | ''
  monthlyInterestPercent: number | ''
  autoCalculatePenaltyInterest: boolean
  internalCode: string

  adjustmentBaseMonth: string
  annualAdjustmentIndex: AdjustmentIndex | ''
  nextAdjustmentDate: string
  generateFinancialFrom: string
  rentAmount: number | ''
  guaranteedRent: boolean
  guaranteedRentDurationMonths: number | ''
  adminFeeMode: AdminFeeMode
  adminFeeAmount: number | ''
  onTimeDiscountMode: OnTimeDiscountMode
  onTimeDiscountAmount: number | ''
  proportionalRent: number | ''

  firstRentCommission: FirstRentCommissionMode
  commissionAmount: number | ''
  commissionInstallments: number | ''
  commissionPostMonth: string

  hasTerminationPenalty: boolean
  terminationPenaltyAmount: number | ''
  waivePenaltyAfterMonths: number | ''

  waterUtilities: boolean
  powerUtilities: boolean
  gasUtilities: boolean
}

export const defaultContractGeneralData = (): ContractGeneralData => ({
  contractType: '',
  contractStartDate: '',
  durationMonths: 12,
  contractEndDate: '',
  autoRenewal: false,
  baseDurationMonths: 12,
  contractSigningDate: '',
  keyHandoverDate: '',
  firstDueDateFrom: '',
  billingSchedule: 'dueDate',
  penaltyPercent: 10,
  monthlyInterestPercent: 1,
  autoCalculatePenaltyInterest: true,
  internalCode: '',

  adjustmentBaseMonth: '',
  annualAdjustmentIndex: 'igpm',
  nextAdjustmentDate: '',
  generateFinancialFrom: '',
  rentAmount: '',
  guaranteedRent: false,
  guaranteedRentDurationMonths: 12,
  adminFeeMode: 'percentual',
  adminFeeAmount: 10,
  onTimeDiscountMode: 'percentual',
  onTimeDiscountAmount: '',
  proportionalRent: '',

  firstRentCommission: 'none',
  commissionAmount: '',
  commissionInstallments: 1,
  commissionPostMonth: '',

  hasTerminationPenalty: false,
  terminationPenaltyAmount: '',
  waivePenaltyAfterMonths: '',

  waterUtilities: false,
  powerUtilities: false,
  gasUtilities: false,
})

export function addMonthsToIsoDate(isoDate: string, months: number): string {
  if (!isoDate || !months) return ''
  const date = new Date(`${isoDate}T12:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  date.setMonth(date.getMonth() + months)
  return date.toISOString().slice(0, 10)
}

export function isContractGeneralValid(data: ContractGeneralData): boolean {
  return (
    Boolean(data.contractType) &&
    Boolean(data.contractStartDate) &&
    typeof data.durationMonths === 'number' &&
    data.durationMonths > 0 &&
    Boolean(data.billingSchedule) &&
    typeof data.rentAmount === 'number' &&
    data.rentAmount > 0
  )
}

export const CONTRACT_TYPE_OPTIONS: { value: ContractType; label: string }[] = [
  { value: 'residential', label: 'Residencial' },
  { value: 'commercial', label: 'Comercial' },
  { value: 'seasonal', label: 'Temporada' },
]

export const BILLING_SCHEDULE_OPTIONS: { value: BillingSchedule; label: string }[] = [
  { value: 'dueDate', label: 'Vencimento' },
  { value: 'fixedDay', label: 'Dia fixo' },
  { value: 'prepaid', label: 'Antecipado' },
]

export const INDICE_REAJUSTE_OPTIONS: { value: AdjustmentIndex; label: string }[] = [
  { value: 'igpm', label: 'IGP-M' },
  { value: 'ipca', label: 'IPCA' },
  { value: 'inpc', label: 'INPC' },
  { value: 'fixedPercent', label: 'Percentual fixo' },
]

export const COMISSAO_OPTIONS: {
  value: FirstRentCommissionMode
  label: string
}[] = [
  { value: 'none', label: 'Não tem' },
  { value: 'percentual', label: 'Percentual' },
  { value: 'fixedAmount', label: 'Valor fixo' },
]

export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1).padStart(2, '0'),
}))

export const INSTALLMENT_COUNT_OPTIONS = [1, 2, 3, 4, 5, 6, 12].map((n) => ({
  value: String(n),
  label: `${n}x`,
}))
