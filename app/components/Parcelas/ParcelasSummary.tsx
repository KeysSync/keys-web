import { PARCELAS_CURRENT_MONTH } from '@/lib/parcelas/constants'
import { formatParcelaCurrency } from '@/lib/parcelas/format'
import type { ParcelasSummaryStats } from '@/lib/parcelas/types'

export interface ParcelasSummaryProps {
  stats: ParcelasSummaryStats
}

export function ParcelasSummary({ stats }: ParcelasSummaryProps) {
  const [year, month] = PARCELAS_CURRENT_MONTH.split('-')
  const monthLabel = `${month}/${year}`

  return (
    <div className="parc-summary">
      <article className="parc-summary-card">
        <p className="parc-summary-label">A receber em {monthLabel}</p>
        <p className="parc-summary-value">
          {formatParcelaCurrency(stats.receberMes)}
        </p>
        <p className="parc-summary-hint">Parcelas com vencimento neste mês</p>
      </article>
      <article className="parc-summary-card">
        <p className="parc-summary-label">Total em aberto</p>
        <p className="parc-summary-value">
          {formatParcelaCurrency(stats.emAberto)}
        </p>
        <p className="parc-summary-hint">A vencer + atrasadas</p>
      </article>
      <article className="parc-summary-card">
        <p className="parc-summary-label">Já recebido</p>
        <p className="parc-summary-value parc-summary-value--paid">
          {formatParcelaCurrency(stats.recebidos)}
        </p>
        <p className="parc-summary-hint">Parcelas marcadas como pagas</p>
      </article>
    </div>
  )
}
