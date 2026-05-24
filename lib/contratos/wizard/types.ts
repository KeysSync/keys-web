import type { Imovel } from '@/lib/mocks/imoveis'
import type { ContratoCobrancaData } from './cobranca'
import type { ContratoGarantiaData } from './garantia'
import type { ContratoGeralData } from './geral'
import type { ContratoLancamentosData } from './lancamentos'
import type { ContratoLocatariosData } from './locatarios'
import type { ContratoRedacaoData } from './redacao'
import type { ContratoSeguroData } from './seguro'

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
  geral: ContratoGeralData
  locatarios: ContratoLocatariosData
  garantia: ContratoGarantiaData
  seguro: ContratoSeguroData
  lancamentos: ContratoLancamentosData
  cobranca: ContratoCobrancaData
  redacao: ContratoRedacaoData
}

export type ImovelParaContrato = Imovel
