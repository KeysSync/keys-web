import type { ContractPropertySummary } from '@/lib/contracts/property-summary'
import type { ContractBillingData } from './billing'
import type { ContractGuaranteeData } from './guarantee'
import type { ContractGeneralData } from './general'
import type { ContractEntriesData } from './entries'
import type { ContractTenantsData } from './contract-tenants'
import type { ContractDraftingData } from './drafting'
import type { ContractInsuranceData } from './insurance'

export type ContractWizardStepId =
  | 'property'
  | 'general'
  | 'tenants'
  | 'guarantee'
  | 'insurance'
  | 'entries'
  | 'billing'
  | 'drafting'

export type PropertySearchMode = 'system' | 'agency' | 'street'

export interface ContractWizardDraft {
  step: ContractWizardStepId
  propertyId: string | null
  propertySearchMode: PropertySearchMode
  general: ContractGeneralData
  tenants: ContractTenantsData
  guarantee: ContractGuaranteeData
  insurance: ContractInsuranceData
  entries: ContractEntriesData
  billing: ContractBillingData
  drafting: ContractDraftingData
}

export type PropertyForContract = ContractPropertySummary
