import { defaultPropertyFormData } from '../form'
import type { PropertyFormData } from '../types'
import { PROPERTY_WIZARD_DEFAULT_STEP } from './constants'
import type { PropertyWizardStepId } from './types'

const DRAFT_KEY = 'keys_property_wizard_draft'

export interface PropertyWizardDraft {
  step: PropertyWizardStepId
  data: PropertyFormData
}

function defaultDraft(): PropertyWizardDraft {
  return {
    step: PROPERTY_WIZARD_DEFAULT_STEP,
    data: defaultPropertyFormData(),
  }
}

export function getPropertyWizardDraft(): PropertyWizardDraft {
  if (typeof window === 'undefined') return defaultDraft()
  const raw = sessionStorage.getItem(DRAFT_KEY)
  if (!raw) return defaultDraft()
  try {
    const parsed = JSON.parse(raw) as Partial<PropertyWizardDraft>
    return {
      step: parsed.step ?? PROPERTY_WIZARD_DEFAULT_STEP,
      data: { ...defaultPropertyFormData(), ...parsed.data },
    }
  } catch {
    return defaultDraft()
  }
}

export function savePropertyWizardDraft(patch: Partial<PropertyWizardDraft>) {
  if (typeof window === 'undefined') return
  const next = { ...getPropertyWizardDraft(), ...patch }
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next))
}

export function clearPropertyWizardDraft() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(DRAFT_KEY)
}
