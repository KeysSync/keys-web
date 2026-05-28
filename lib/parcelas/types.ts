import type { Lancamento, LancamentoStatus } from '@/lib/mocks/lancamentos'

export type ParcelaStatusFilter = 'todos' | LancamentoStatus

export type ParcelasViewMode = 'contrato' | 'vencimento'

export interface ParcelasContratoGroup {
  contratoId: string
  contratoCodigo: string
  imovelTitulo: string
  imovelBairro: string
  inquilino: string
  parcelas: Lancamento[]
  resumo: {
    total: number
    pagas: number
    pendentes: number
    atrasadas: number
    canceladas: number
    valorEmAberto: number
    proximaParcela: Lancamento | null
  }
}

export interface ParcelasSummaryStats {
  receberMes: number
  recebidos: number
  emAberto: number
}
