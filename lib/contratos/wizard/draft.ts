import {
  CONTRATO_CRIAR_ENTRY_KEY,
  CONTRATO_WIZARD_DEFAULT_STEP,
} from './constants'
import {
  defaultContratoCobrancaData,
  type ContratoCobrancaData,
} from './cobranca'
import {
  defaultContratoGarantiaData,
  type ContratoGarantiaData,
} from './garantia'
import { defaultContratoGeralData, type ContratoGeralData } from './geral'
import {
  defaultContratoLancamentosData,
  type ContratoLancamentosData,
} from './lancamentos'
import {
  defaultContratoLocatariosData,
  type ContratoLocatariosData,
} from './locatarios'
import {
  defaultContratoRedacaoData,
  type ContratoRedacaoData,
} from './redacao'
import {
  defaultContratoSegurosData,
  normalizeContratoSegurosData,
  type ContratoSegurosData,
} from './seguro'
import {
  clearContratoCriarEntryCookie,
  setContratoCriarEntryCookie,
} from './entry-cookie'
import type { ContratoWizardDraft, ImovelSearchMode } from './types'

const DRAFT_KEY = 'keys_contrato_wizard_draft'

const defaultDraft = (): ContratoWizardDraft => ({
  step: CONTRATO_WIZARD_DEFAULT_STEP,
  imovelId: null,
  imovelSearchMode: 'imobiliaria',
  geral: defaultContratoGeralData(),
  locatarios: defaultContratoLocatariosData(),
  garantia: defaultContratoGarantiaData(),
  seguro: defaultContratoSegurosData(),
  lancamentos: defaultContratoLancamentosData(),
  cobranca: defaultContratoCobrancaData(),
  redacao: defaultContratoRedacaoData(),
})

export function markContratoCriarEntry() {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(CONTRATO_CRIAR_ENTRY_KEY, '1')
  setContratoCriarEntryCookie()
}

export function hasContratoCriarEntry() {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(CONTRATO_CRIAR_ENTRY_KEY) === '1'
}

export function clearContratoCriarEntry() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(CONTRATO_CRIAR_ENTRY_KEY)
  sessionStorage.removeItem(DRAFT_KEY)
  clearContratoCriarEntryCookie()
}

export function getContratoWizardDraft(): ContratoWizardDraft {
  if (typeof window === 'undefined') return defaultDraft()
  const raw = sessionStorage.getItem(DRAFT_KEY)
  if (!raw) return defaultDraft()
  try {
    const parsed = JSON.parse(raw) as Partial<ContratoWizardDraft>
    return {
      ...defaultDraft(),
      ...parsed,
      geral: { ...defaultContratoGeralData(), ...parsed.geral },
      locatarios: {
        ...defaultContratoLocatariosData(),
        ...parsed.locatarios,
        vinculos: parsed.locatarios?.vinculos ?? [],
      },
      garantia: { ...defaultContratoGarantiaData(), ...parsed.garantia },
      seguro: normalizeContratoSegurosData(parsed.seguro),
      lancamentos: {
        ...defaultContratoLancamentosData(),
        ...parsed.lancamentos,
        itens: parsed.lancamentos?.itens ?? [],
      },
      cobranca: { ...defaultContratoCobrancaData(), ...parsed.cobranca },
      redacao: { ...defaultContratoRedacaoData(), ...parsed.redacao },
    }
  } catch {
    return defaultDraft()
  }
}

export function saveContratoWizardDraft(patch: Partial<ContratoWizardDraft>) {
  if (typeof window === 'undefined') return
  const next = { ...getContratoWizardDraft(), ...patch }
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next))
}

export function patchContratoGeralData(data: ContratoGeralData) {
  saveContratoWizardDraft({ geral: data })
}

export function patchContratoLocatariosData(data: ContratoLocatariosData) {
  saveContratoWizardDraft({ locatarios: data })
}

export function patchContratoGarantiaData(data: ContratoGarantiaData) {
  saveContratoWizardDraft({ garantia: data })
}

export function patchContratoSeguroData(data: ContratoSegurosData) {
  saveContratoWizardDraft({ seguro: data })
}

export function patchContratoLancamentosData(data: ContratoLancamentosData) {
  saveContratoWizardDraft({ lancamentos: data })
}

export function patchContratoCobrancaData(data: ContratoCobrancaData) {
  saveContratoWizardDraft({ cobranca: data })
}

export function patchContratoRedacaoData(data: ContratoRedacaoData) {
  saveContratoWizardDraft({ redacao: data })
}

export function setContratoWizardSearchMode(mode: ImovelSearchMode) {
  saveContratoWizardDraft({ imovelSearchMode: mode })
}

export function selectContratoWizardImovel(imovelId: string) {
  saveContratoWizardDraft({ imovelId })
}
