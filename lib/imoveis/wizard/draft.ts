import { defaultImovelFormData } from '../form'
import type { ImovelFormData } from '../types'
import { IMOVEL_WIZARD_DEFAULT_STEP } from './constants'
import type { ImovelWizardStepId } from './types'

const DRAFT_KEY = 'keys_imovel_wizard_draft'

export interface ImovelWizardDraft {
  step: ImovelWizardStepId
  data: ImovelFormData
}

function defaultDraft(): ImovelWizardDraft {
  return {
    step: IMOVEL_WIZARD_DEFAULT_STEP,
    data: defaultImovelFormData(),
  }
}

export function getImovelWizardDraft(): ImovelWizardDraft {
  if (typeof window === 'undefined') return defaultDraft()
  const raw = sessionStorage.getItem(DRAFT_KEY)
  if (!raw) return defaultDraft()
  try {
    const parsed = JSON.parse(raw) as Partial<ImovelWizardDraft>
    return {
      step: parsed.step ?? IMOVEL_WIZARD_DEFAULT_STEP,
      data: { ...defaultImovelFormData(), ...parsed.data },
    }
  } catch {
    return defaultDraft()
  }
}

export function saveImovelWizardDraft(patch: Partial<ImovelWizardDraft>) {
  if (typeof window === 'undefined') return
  const next = { ...getImovelWizardDraft(), ...patch }
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next))
}

export function clearImovelWizardDraft() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(DRAFT_KEY)
}
