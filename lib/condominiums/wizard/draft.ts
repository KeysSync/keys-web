import { defaultCondominiumFormData } from '../form'
import type { CondominiumFormData } from '../types'
import { CONDOMINIUM_WIZARD_DEFAULT_STEP } from './constants'
import type { CondominiumWizardStepId } from './types'

const DRAFT_KEY = 'keys_condominium_wizard_draft'

export interface CondominiumWizardDraft {
  step: CondominiumWizardStepId
  data: CondominiumFormData
}

function defaultDraft(): CondominiumWizardDraft {
  return {
    step: CONDOMINIUM_WIZARD_DEFAULT_STEP,
    data: defaultCondominiumFormData(),
  }
}

export function getCondominiumWizardDraft(): CondominiumWizardDraft {
  if (typeof window === 'undefined') return defaultDraft()
  const raw = sessionStorage.getItem(DRAFT_KEY)
  if (!raw) return defaultDraft()
  try {
    const parsed = JSON.parse(raw) as Partial<CondominiumWizardDraft>
    const defaults = defaultCondominiumFormData()
    return {
      step: parsed.step ?? CONDOMINIUM_WIZARD_DEFAULT_STEP,
      data: {
        ...defaults,
        ...parsed.data,
        address: { ...defaults.address, ...parsed.data?.address },
      },
    }
  } catch {
    return defaultDraft()
  }
}

export function saveCondominiumWizardDraft(patch: Partial<CondominiumWizardDraft>) {
  if (typeof window === 'undefined') return
  const next = { ...getCondominiumWizardDraft(), ...patch }
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next))
}

export function clearCondominiumWizardDraft() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(DRAFT_KEY)
}
