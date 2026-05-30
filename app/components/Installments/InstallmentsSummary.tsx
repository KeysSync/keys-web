import { INSTALLMENTS_CURRENT_MONTH } from '@/lib/installments/constants'
import { formatInstallmentCurrency } from '@/lib/installments/format'
import type { InstallmentsSummaryStats } from '@/lib/installments/types'

export interface InstallmentsSummaryProps {
  stats: InstallmentsSummaryStats
}

export function InstallmentsSummary({ stats }: InstallmentsSummaryProps) {
  const [year, month] = INSTALLMENTS_CURRENT_MONTH.split('-')
  const monthLabel = `${month}/${year}`

  return (
    <div className="installments-summary">
      <article className="installments-summary-card">
        <p className="installments-summary-label">A receber em {monthLabel}</p>
        <p className="installments-summary-value">
          {formatInstallmentCurrency(stats.dueThisMonth)}
        </p>
        <p className="installments-summary-hint">Installments com vencimento neste mês</p>
      </article>
      <article className="installments-summary-card">
        <p className="installments-summary-label">Total em aberto</p>
        <p className="installments-summary-value">
          {formatInstallmentCurrency(stats.open)}
        </p>
        <p className="installments-summary-hint">A vencer + atrasadas</p>
      </article>
      <article className="installments-summary-card">
        <p className="installments-summary-label">Já recebido</p>
        <p className="installments-summary-value installments-summary-value--paid">
          {formatInstallmentCurrency(stats.received)}
        </p>
        <p className="installments-summary-hint">Installments marcadas como pagas</p>
      </article>
    </div>
  )
}
