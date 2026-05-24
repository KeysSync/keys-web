export interface ContratoRedacaoData {
  modeloId: string
  clausulasAdicionais: string
  incluirAnexoVistoria: boolean
  incluirAnexoRegulamento: boolean
  observacoesInternas: string
}

export const CONTRATO_MODELO_OPTIONS = [
  { id: 'residencial-padrao', label: 'Residencial — padrão' },
  { id: 'residencial-comercial', label: 'Misto residencial/comercial' },
  { id: 'comercial-sala', label: 'Comercial — sala/loja' },
  { id: 'temporada', label: 'Temporada' },
  { id: 'personalizado', label: 'Personalizado (rascunho livre)' },
] as const

export const defaultContratoRedacaoData = (): ContratoRedacaoData => ({
  modeloId: 'residencial-padrao',
  clausulasAdicionais: '',
  incluirAnexoVistoria: true,
  incluirAnexoRegulamento: false,
  observacoesInternas: '',
})
