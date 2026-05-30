import type { ContractWizardStepId } from './types'

export const CONTRACT_CREATE_ENTRY_KEY = 'keys_contract_create_entry'

export const CONTRACT_WIZARD_STEPS: {
  id: ContractWizardStepId
  label: string
}[] = [
  { id: 'property', label: 'Imóvel' },
  { id: 'general', label: 'Geral' },
  { id: 'tenants', label: 'Locatários' },
  { id: 'guarantee', label: 'Garantia' },
  { id: 'insurance', label: 'Seguros' },
  { id: 'entries', label: 'Lançamentos' },
  { id: 'billing', label: 'Cobrança' },
  { id: 'drafting', label: 'Redação' },
]

export const CONTRACT_WIZARD_DEFAULT_STEP: ContractWizardStepId = 'property'
