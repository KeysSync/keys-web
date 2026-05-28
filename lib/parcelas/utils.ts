import { mockLancamentos, type Lancamento } from '@/lib/mocks/lancamentos'
import { PARCELAS_CURRENT_MONTH } from './constants'
import { monthOfIso } from './format'
import type {
  ParcelaStatusFilter,
  ParcelasContratoGroup,
  ParcelasSummaryStats,
} from './types'

export function getParcelaStatusCounts(
  parcelas: Lancamento[] = mockLancamentos,
): Record<ParcelaStatusFilter, number> {
  const counts: Record<ParcelaStatusFilter, number> = {
    todos: parcelas.length,
    pendente: 0,
    pago: 0,
    atrasado: 0,
    cancelado: 0,
  }
  for (const l of parcelas) counts[l.status] += 1
  return counts
}

export function getParcelasSummaryStats(
  parcelas: Lancamento[] = mockLancamentos,
): ParcelasSummaryStats {
  const inMonth = parcelas.filter(
    (l) =>
      monthOfIso(l.vencimento) === PARCELAS_CURRENT_MONTH &&
      l.status !== 'cancelado',
  )
  const receberMes = inMonth.reduce((sum, l) => sum + l.valor, 0)
  const recebidos = parcelas
    .filter((l) => l.status === 'pago')
    .reduce((sum, l) => sum + l.valor, 0)
  const emAberto = parcelas
    .filter((l) => l.status === 'pendente' || l.status === 'atrasado')
    .reduce((sum, l) => sum + l.valor, 0)

  return { receberMes, recebidos, emAberto }
}

export function filterParcelas(
  parcelas: Lancamento[],
  statusFilter: ParcelaStatusFilter,
  search: string,
): Lancamento[] {
  const q = search.trim().toLowerCase()

  return parcelas.filter((l) => {
    if (statusFilter !== 'todos' && l.status !== statusFilter) return false
    if (!q) return true

    return (
      l.contratoCodigo.toLowerCase().includes(q) ||
      l.imovelTitulo.toLowerCase().includes(q) ||
      l.imovelBairro.toLowerCase().includes(q) ||
      l.inquilino.toLowerCase().includes(q) ||
      l.descricao.toLowerCase().includes(q)
    )
  })
}

export function groupParcelasByContrato(
  parcelas: Lancamento[],
): ParcelasContratoGroup[] {
  const map = new Map<string, ParcelasContratoGroup>()

  for (const p of parcelas) {
    let group = map.get(p.contratoId)
    if (!group) {
      group = {
        contratoId: p.contratoId,
        contratoCodigo: p.contratoCodigo,
        imovelTitulo: p.imovelTitulo,
        imovelBairro: p.imovelBairro,
        inquilino: p.inquilino,
        parcelas: [],
        resumo: {
          total: 0,
          pagas: 0,
          pendentes: 0,
          atrasadas: 0,
          canceladas: 0,
          valorEmAberto: 0,
          proximaParcela: null,
        },
      }
      map.set(p.contratoId, group)
    }

    group.parcelas.push(p)
    group.resumo.total += 1
    if (p.status === 'pago') group.resumo.pagas += 1
    else if (p.status === 'pendente') group.resumo.pendentes += 1
    else if (p.status === 'atrasado') group.resumo.atrasadas += 1
    else if (p.status === 'cancelado') group.resumo.canceladas += 1
  }

  for (const g of map.values()) {
    g.parcelas.sort((a, b) => a.vencimento.localeCompare(b.vencimento))
    const emAberto = g.parcelas.filter(
      (p) => p.status === 'pendente' || p.status === 'atrasado',
    )
    g.resumo.proximaParcela = emAberto[0] ?? null
    g.resumo.valorEmAberto = emAberto.reduce((s, p) => s + p.valor, 0)
  }

  return Array.from(map.values()).sort((a, b) => {
    if (a.resumo.atrasadas !== b.resumo.atrasadas) {
      return b.resumo.atrasadas - a.resumo.atrasadas
    }
    return a.contratoCodigo.localeCompare(b.contratoCodigo)
  })
}
