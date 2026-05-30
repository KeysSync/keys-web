import {
  ENTRY_STATUS_LABEL,
  ENTRY_TYPE_LABEL,
  type Entry,
} from '@/lib/installments/entry-types'
import { formatInstallmentCurrency, formatInstallmentDate } from '@/lib/installments/format'

export interface ContractInstallmentsGroupProps {
  title: string
  description: string
  tone: 'overdue' | 'pending' | 'paid' | 'cancelled'
  installments: Entry[]
}

export function ContractInstallmentsGroup({
  title,
  description,
  tone,
  installments,
}: ContractInstallmentsGroupProps) {
  if (installments.length === 0) return null

  const total = installments.reduce((sum, item) => sum + item.amount, 0)

  return (
    <section className="contract-detail-group">
      <header
        className={`contract-detail-group-head contract-detail-group-head--${tone}`}
      >
        <span className="contract-detail-group-title-wrap">
          <span className="contract-detail-group-title">
            <span
              className={`contract-detail-group-dot contract-detail-group-dot--${tone}`}
              aria-hidden
            />
            {title}
          </span>
          <span className="contract-detail-group-desc">{description}</span>
        </span>
        <span className="contract-detail-group-info">
          {installments.length} parcela{installments.length === 1 ? '' : 's'} ·{' '}
          {formatInstallmentCurrency(total)}
        </span>
      </header>

      <table className="contract-detail-table">
        <thead>
          <tr>
            <th>Vencimento</th>
            <th>Descrição</th>
            <th>Tipo</th>
            <th className="contract-detail-col-amount">Valor</th>
            <th className="contract-detail-col-status">Status</th>
          </tr>
        </thead>
        <tbody>
          {installments.map((entry) => (
            <tr key={entry.id}>
              <td>
                <div className="contract-detail-dueDate">
                  <span className="contract-detail-dueDate-date">
                    {formatInstallmentDate(entry.dueDate)}
                  </span>
                  {entry.paidAt ? (
                    <span className="contract-detail-dueDate-paid">
                      pago em {formatInstallmentDate(entry.paidAt)}
                    </span>
                  ) : null}
                </div>
              </td>
              <td>{entry.description}</td>
              <td>
                <span
                  className={`contract-detail-type contract-detail-type--${entry.type}`}
                >
                  {ENTRY_TYPE_LABEL[entry.type]}
                </span>
              </td>
              <td className="contract-detail-col-amount contract-detail-amount">
                {formatInstallmentCurrency(entry.amount)}
              </td>
              <td className="contract-detail-col-status">
                <span
                  className={`contract-detail-badge-installment contract-detail-badge-installment--${entry.status}`}
                >
                  {ENTRY_STATUS_LABEL[entry.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
