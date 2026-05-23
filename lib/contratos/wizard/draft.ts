import {
  CONTRATO_CRIAR_ENTRY_KEY,
  CONTRATO_WIZARD_DEFAULT_STEP,
} from './constants'
import type { ContratoWizardDraft, ImovelSearchMode } from './types'

const DRAFT_KEY = 'keys_contrato_wizard_draft'

const defaultDraft = (): ContratoWizardDraft => ({
  step: CONTRATO_WIZARD_DEFAULT_STEP,
  imovelId: null,
  imovelSearchMode: 'imobiliaria',
})

export function markContratoCriarEntry() {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(CONTRATO_CRIAR_ENTRY_KEY, '1')
}

export function hasContratoCriarEntry() {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(CONTRATO_CRIAR_ENTRY_KEY) === '1'
}

export function clearContratoCriarEntry() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(CONTRATO_CRIAR_ENTRY_KEY)
  sessionStorage.removeItem(DRAFT_KEY)
}

export function getContratoWizardDraft(): ContratoWizardDraft {
  if (typeof window === 'undefined') return defaultDraft()
  const raw = sessionStorage.getItem(DRAFT_KEY)
  if (!raw) return defaultDraft()
  try {
    return { ...defaultDraft(), ...(JSON.parse(raw) as ContratoWizardDraft) }
  } catch {
    return defaultDraft()
  }
}

export function saveContratoWizardDraft(patch: Partial<ContratoWizardDraft>) {
  if (typeof window === 'undefined') return
  const next = { ...getContratoWizardDraft(), ...patch }
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next))
}

export function setContratoWizardSearchMode(mode: ImovelSearchMode) {
  saveContratoWizardDraft({ imovelSearchMode: mode })
}

export function selectContratoWizardImovel(imovelId: string) {
  saveContratoWizardDraft({ imovelId })
}
