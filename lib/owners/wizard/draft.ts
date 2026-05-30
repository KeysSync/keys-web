import { defaultOwnerFormData } from '../form'
import type { OwnerFormData } from '../types'
import { OWNER_WIZARD_DEFAULT_STEP } from './constants'
import type { OwnerWizardStepId } from './types'

const DRAFT_KEY = 'keys_owner_wizard_draft'

export interface OwnerWizardDraft {
  step: OwnerWizardStepId
  data: OwnerFormData
}

function defaultDraft(): OwnerWizardDraft {
  return {
    step: OWNER_WIZARD_DEFAULT_STEP,
    data: defaultOwnerFormData(),
  }
}

export function getOwnerWizardDraft(): OwnerWizardDraft {
  if (typeof window === 'undefined') return defaultDraft()
  const raw = sessionStorage.getItem(DRAFT_KEY)
  if (!raw) return defaultDraft()
  try {
    const parsed = JSON.parse(raw) as Partial<OwnerWizardDraft>
    return {
      step: parsed.step ?? OWNER_WIZARD_DEFAULT_STEP,
      data: {
        ...defaultOwnerFormData(),
        ...parsed.data,
        phones: parsed.data?.phones ?? defaultOwnerFormData().phones,
        bank_account: parsed.data?.bank_account ?? [],
      },
    }
  } catch {
    return defaultDraft()
  }
}

export function saveOwnerWizardDraft(patch: Partial<OwnerWizardDraft>) {
  if (typeof window === 'undefined') return
  const next = { ...getOwnerWizardDraft(), ...patch }
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next))
}

export function clearOwnerWizardDraft() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(DRAFT_KEY)
}
