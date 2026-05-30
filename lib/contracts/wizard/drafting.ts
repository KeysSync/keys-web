export interface ContractDraftingData {
  templateId: string
  additionalClauses: string
  includeInspectionAnnex: boolean
  includeRulesAnnex: boolean
  internalNotes: string
}

export const CONTRACT_MODEL_OPTIONS = [
  { id: 'residencial-padrao', label: 'Residencial — padrão' },
  { id: 'residencial-comercial', label: 'Misto residencial/comercial' },
  { id: 'comercial-sala', label: 'Comercial — sala/loja' },
  { id: 'seasonal', label: 'Temporada' },
  { id: 'personalizado', label: 'Personalizado (rascunho livre)' },
] as const

export const defaultContractDraftingData = (): ContractDraftingData => ({
  templateId: 'residencial-padrao',
  additionalClauses: '',
  includeInspectionAnnex: true,
  includeRulesAnnex: false,
  internalNotes: '',
})
