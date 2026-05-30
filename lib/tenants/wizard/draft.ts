import { defaultOwnerFormData } from '@/lib/owners/form'
import type { OwnerFormData } from '@/lib/owners/types'
import { TENANT_WIZARD_DEFAULT_STEP } from './constants'
import type { TenantWizardStepId } from './types'

const DRAFT_KEY = 'keys_tenant_wizard_draft'

export interface TenantWizardDraft {
  step: TenantWizardStepId
  data: OwnerFormData
}

function defaultDraft(): TenantWizardDraft {
  return {
    step: TENANT_WIZARD_DEFAULT_STEP,
    data: defaultOwnerFormData(),
  }
}

export function getTenantWizardDraft(): TenantWizardDraft {
  if (typeof window === 'undefined') return defaultDraft()
  const raw = sessionStorage.getItem(DRAFT_KEY)
  if (!raw) return defaultDraft()
  try {
    const parsed = JSON.parse(raw) as Partial<TenantWizardDraft>
    return {
      step: parsed.step ?? TENANT_WIZARD_DEFAULT_STEP,
      data: {
        ...defaultOwnerFormData(),
        ...parsed.data,
        phones: parsed.data?.phones ?? defaultOwnerFormData().phones,
        bank_account: [],
      },
    }
  } catch {
    return defaultDraft()
  }
}

export function saveTenantWizardDraft(patch: Partial<TenantWizardDraft>) {
  if (typeof window === 'undefined') return
  const next = { ...getTenantWizardDraft(), ...patch }
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next))
}

export function clearTenantWizardDraft() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(DRAFT_KEY)
}
