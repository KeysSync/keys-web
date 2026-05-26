import { defaultProprietarioFormData } from '../form'
import type { ProprietarioFormData } from '../types'
import { PROPRIETARIO_WIZARD_DEFAULT_STEP } from './constants'
import type { ProprietarioWizardStepId } from './types'

const DRAFT_KEY = 'keys_proprietario_wizard_draft'

export interface ProprietarioWizardDraft {
  step: ProprietarioWizardStepId
  data: ProprietarioFormData
}

function defaultDraft(): ProprietarioWizardDraft {
  return {
    step: PROPRIETARIO_WIZARD_DEFAULT_STEP,
    data: defaultProprietarioFormData(),
  }
}

export function getProprietarioWizardDraft(): ProprietarioWizardDraft {
  if (typeof window === 'undefined') return defaultDraft()
  const raw = sessionStorage.getItem(DRAFT_KEY)
  if (!raw) return defaultDraft()
  try {
    const parsed = JSON.parse(raw) as Partial<ProprietarioWizardDraft>
    return {
      step: parsed.step ?? PROPRIETARIO_WIZARD_DEFAULT_STEP,
      data: {
        ...defaultProprietarioFormData(),
        ...parsed.data,
        telefones: parsed.data?.telefones ?? defaultProprietarioFormData().telefones,
        bank_account: parsed.data?.bank_account ?? [],
      },
    }
  } catch {
    return defaultDraft()
  }
}

export function saveProprietarioWizardDraft(patch: Partial<ProprietarioWizardDraft>) {
  if (typeof window === 'undefined') return
  const next = { ...getProprietarioWizardDraft(), ...patch }
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next))
}

export function clearProprietarioWizardDraft() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(DRAFT_KEY)
}
