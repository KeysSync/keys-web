import type { Imovel } from '@/lib/mocks/imoveis'

export type ContratoWizardStepId =
  | 'imovel'
  | 'geral'
  | 'locatarios'
  | 'garantia'
  | 'seguro'
  | 'lancamentos'
  | 'cobranca'
  | 'redacao'

export type ImovelSearchMode = 'sistema' | 'imobiliaria' | 'logradouro'

export interface ContratoWizardDraft {
  step: ContratoWizardStepId
  imovelId: string | null
  imovelSearchMode: ImovelSearchMode
}

export type ImovelParaContrato = Imovel
