import { defaultProprietarioFormData } from '@/lib/proprietarios/form'
import type { ProprietarioFormData } from '@/lib/proprietarios/types'
import { INQUILINO_WIZARD_DEFAULT_STEP } from './constants'
import type { InquilinoWizardStepId } from './types'

const DRAFT_KEY = 'keys_inquilino_wizard_draft'

export interface InquilinoWizardDraft {
  step: InquilinoWizardStepId
  data: ProprietarioFormData
}

function defaultDraft(): InquilinoWizardDraft {
  return {
    step: INQUILINO_WIZARD_DEFAULT_STEP,
    data: defaultProprietarioFormData(),
  }
}

export function getInquilinoWizardDraft(): InquilinoWizardDraft {
  if (typeof window === 'undefined') return defaultDraft()
  const raw = sessionStorage.getItem(DRAFT_KEY)
  if (!raw) return defaultDraft()
  try {
    const parsed = JSON.parse(raw) as Partial<InquilinoWizardDraft>
    return {
      step: parsed.step ?? INQUILINO_WIZARD_DEFAULT_STEP,
      data: {
        ...defaultProprietarioFormData(),
        ...parsed.data,
        telefones: parsed.data?.telefones ?? defaultProprietarioFormData().telefones,
        bank_account: [],
      },
    }
  } catch {
    return defaultDraft()
  }
}

export function saveInquilinoWizardDraft(patch: Partial<InquilinoWizardDraft>) {
  if (typeof window === 'undefined') return
  const next = { ...getInquilinoWizardDraft(), ...patch }
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next))
}

export function clearInquilinoWizardDraft() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(DRAFT_KEY)
}
