import type { ContratoWizardStepId } from './types'

export const CONTRATO_CRIAR_ENTRY_KEY = 'keys_contrato_criar_entry'

export const CONTRATO_WIZARD_STEPS: {
  id: ContratoWizardStepId
  label: string
}[] = [
  { id: 'imovel', label: 'Imóvel' },
  { id: 'geral', label: 'Geral' },
  { id: 'locatarios', label: 'Locatários' },
  { id: 'garantia', label: 'Garantia' },
  { id: 'seguro', label: 'Seguro incêndio' },
  { id: 'lancamentos', label: 'Lançamentos' },
  { id: 'cobranca', label: 'Cobrança' },
  { id: 'redacao', label: 'Redação' },
]

export const CONTRATO_WIZARD_DEFAULT_STEP: ContratoWizardStepId = 'imovel'
