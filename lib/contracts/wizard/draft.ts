import {
  CONTRACT_CREATE_ENTRY_KEY,
  CONTRACT_WIZARD_DEFAULT_STEP,
} from './constants'
import {
  defaultContractBillingData,
  isContractBillingValid,
  type ContractBillingData,
} from './billing'
import {
  defaultContractGuaranteeData,
  type ContractGuaranteeData,
} from './guarantee'
import {
  defaultContractGeneralData,
  isContractGeneralValid,
  type ContractGeneralData,
} from './general'
import {
  defaultContractEntriesData,
  type ContractEntriesData,
} from './entries'
import {
  defaultContractTenantsData,
  isContractTenantsValid,
  type ContractTenantsData,
} from './contract-tenants'
import {
  defaultContractDraftingData,
  type ContractDraftingData,
} from './drafting'
import {
  defaultContractInsurancesData,
  normalizeContractInsurancesData,
  type ContractInsurancesData,
} from './insurance'
import {
  clearContractCreateEntryCookie,
  setContractCreateEntryCookie,
} from './entry-cookie'
import type { ContractWizardDraft, PropertySearchMode } from './types'

const DRAFT_KEY = 'keys_contract_wizard_draft'

const defaultDraft = (): ContractWizardDraft => ({
  step: CONTRACT_WIZARD_DEFAULT_STEP,
  propertyId: null,
  propertySearchMode: 'agency',
  general: defaultContractGeneralData(),
  tenants: defaultContractTenantsData(),
  guarantee: defaultContractGuaranteeData(),
  insurance: defaultContractInsurancesData(),
  entries: defaultContractEntriesData(),
  billing: defaultContractBillingData(),
  drafting: defaultContractDraftingData(),
})

export function markContractCreateEntry() {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(CONTRACT_CREATE_ENTRY_KEY, '1')
  setContractCreateEntryCookie()
}

export function hasContractCreateEntry() {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(CONTRACT_CREATE_ENTRY_KEY) === '1'
}

export function clearContractCreateEntry() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(CONTRACT_CREATE_ENTRY_KEY)
  sessionStorage.removeItem(DRAFT_KEY)
  clearContractCreateEntryCookie()
}

export function getContractWizardDraft(): ContractWizardDraft {
  if (typeof window === 'undefined') return defaultDraft()
  const raw = sessionStorage.getItem(DRAFT_KEY)
  if (!raw) return defaultDraft()
  try {
    const parsed = JSON.parse(raw) as Partial<ContractWizardDraft>
    return {
      ...defaultDraft(),
      ...parsed,
      general: { ...defaultContractGeneralData(), ...parsed.general },
      tenants: {
        ...defaultContractTenantsData(),
        ...parsed.tenants,
        links: parsed.tenants?.links ?? [],
      },
      guarantee: { ...defaultContractGuaranteeData(), ...parsed.guarantee },
      insurance: normalizeContractInsurancesData(parsed.insurance),
      entries: {
        ...defaultContractEntriesData(),
        ...parsed.entries,
        items: parsed.entries?.items ?? [],
      },
      billing: { ...defaultContractBillingData(), ...parsed.billing },
      drafting: { ...defaultContractDraftingData(), ...parsed.drafting },
    }
  } catch {
    return defaultDraft()
  }
}

export function saveContractWizardDraft(patch: Partial<ContractWizardDraft>) {
  if (typeof window === 'undefined') return
  const next = { ...getContractWizardDraft(), ...patch }
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next))
}

export interface ContractDraftPendingStep {
  id: ContractWizardDraft['step']
  label: string
}

export function getContractDraftPendingSteps(
  draft: ContractWizardDraft,
): ContractDraftPendingStep[] {
  const pending: ContractDraftPendingStep[] = []
  if (!draft.propertyId) pending.push({ id: 'property', label: 'Imóvel' })
  if (!isContractGeneralValid(draft.general))
    pending.push({ id: 'general', label: 'Geral' })
  if (!isContractTenantsValid(draft.tenants))
    pending.push({ id: 'tenants', label: 'Locatários' })
  if (!isContractBillingValid(draft.billing))
    pending.push({ id: 'billing', label: 'Cobrança' })
  return pending
}

export function patchContractGeneralData(data: ContractGeneralData) {
  saveContractWizardDraft({ general: data })
}

export function patchContractTenantsData(data: ContractTenantsData) {
  saveContractWizardDraft({ tenants: data })
}

export function patchContractGuaranteeData(data: ContractGuaranteeData) {
  saveContractWizardDraft({ guarantee: data })
}

export function patchContractInsuranceData(data: ContractInsurancesData) {
  saveContractWizardDraft({ insurance: data })
}

export function patchContractEntriesData(data: ContractEntriesData) {
  saveContractWizardDraft({ entries: data })
}

export function patchContractBillingData(data: ContractBillingData) {
  saveContractWizardDraft({ billing: data })
}

export function patchContractDraftingData(data: ContractDraftingData) {
  saveContractWizardDraft({ drafting: data })
}

export function setContractWizardSearchMode(mode: PropertySearchMode) {
  saveContractWizardDraft({ propertySearchMode: mode })
}

export function selectContractWizardProperty(propertyId: string) {
  saveContractWizardDraft({ propertyId })
}
