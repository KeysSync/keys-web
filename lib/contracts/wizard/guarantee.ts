export type GuaranteeType =
  | 'none'
  | 'guarantor'
  | 'deposit'
  | 'rentGuaranteeInsurance'
  | 'capitalizationBond'

export interface ContractGuaranteeData {
  type: GuaranteeType
  amount: number | ''
  guarantorName: string
  guarantorDocument: string
  validFrom: string
  validUntil: string
  notes: string
}

export const defaultContractGuaranteeData = (): ContractGuaranteeData => ({
  type: 'none',
  amount: '',
  guarantorName: '',
  guarantorDocument: '',
  validFrom: '',
  validUntil: '',
  notes: '',
})

export const GUARANTEE_TYPE_OPTIONS: { value: GuaranteeType; label: string }[] = [
  { value: 'none', label: 'Sem garantia' },
  { value: 'guarantor', label: 'Fiador' },
  { value: 'deposit', label: 'Caução' },
  { value: 'rentGuaranteeInsurance', label: 'Seguro fiança' },
  { value: 'capitalizationBond', label: 'Título de capitalização' },
]
