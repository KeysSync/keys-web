import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import {
  ENTRY_TYPE_LABEL,
  type Entry,
} from '@/lib/installments/entry-types'
import { formatInstallmentCurrency, formatInstallmentDate } from '@/lib/installments/format'
import { InstallmentStatusBadge } from './InstallmentStatusBadge'

export interface InstallmentsByDueDateListProps {
  installments: Entry[]
}

export function InstallmentsByDueDateList({
  installments,
}: InstallmentsByDueDateListProps) {
  if (installments.length === 0) {
    return (
      <p className="installments-empty">Nenhuma parcela encontrada com esses filtros.</p>
    )
  }

  return (
    <div className="installments-timeline">
      <ul className="installments-timeline-list">
        {installments.map((entry) => (
          <li key={entry.id} className="installments-timeline-item">
            <div className="installments-timeline-main">
              <time className="installments-timeline-date" dateTime={entry.dueDate}>
                {formatInstallmentDate(entry.dueDate)}
              </time>
              <div className="installments-timeline-body">
                <p className="installments-timeline-desc">{entry.description}</p>
                <p className="installments-timeline-meta">
                  {entry.propertyTitle} · {entry.contractCode} ·{' '}
                  {ENTRY_TYPE_LABEL[entry.type]}
                </p>
              </div>
              <div className="installments-timeline-end">
                <span className="installments-timeline-amount">
                  {formatInstallmentCurrency(entry.amount)}
                </span>
                <InstallmentStatusBadge status={entry.status} />
              </div>
            </div>
            <Link
              href={`/locacao/contratos/${entry.contractId}`}
              className="installments-timeline-link"
            >
              Installments do contrato
              <ChevronRight size={16} aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
