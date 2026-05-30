import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import { formatInstallmentCurrency, formatInstallmentDate } from '@/lib/installments/format'
import type { InstallmentsContractGroup } from '@/lib/installments/types'
import { InstallmentStatusBadge } from './InstallmentStatusBadge'

const PREVIEW_LIMIT = 4

export interface InstallmentsByContractCardProps {
  group: InstallmentsContractGroup
}

export function InstallmentsByContractCard({ group }: InstallmentsByContractCardProps) {
  const contratoHref = `/locacao/contratos/${group.contractId}`
  const preview = group.installments.slice(0, PREVIEW_LIMIT)
  const remaining = group.installments.length - preview.length
  const g = group

  return (
    <article className="installments-contract-card">
      <header className="installments-contract-head">
        <div className="installments-contract-ident">
          <span className="installments-contract-icon" aria-hidden>
            <Building2 size={20} />
          </span>
          <div>
            <h3 className="installments-contract-title">{g.propertyTitle}</h3>
            <p className="installments-contract-sub">
              Contract <strong>{g.contractCode}</strong> · {g.propertyNeighborhood} ·
              Inquilino: {g.tenant}
            </p>
          </div>
        </div>
        <Link href={contratoHref} className="installments-contract-cta">
          Ver todas as parcelas
          <ChevronRight size={18} aria-hidden />
        </Link>
      </header>

      <div className="installments-contract-stats">
        <span className="installments-contract-stat">
          <strong>{g.summary.total}</strong> no total
        </span>
        {g.summary.paid > 0 ? (
          <span className="installments-contract-stat installments-contract-stat--paid">
            <CheckCircle2 size={14} aria-hidden />
            <strong>{g.summary.paid}</strong> pagas
          </span>
        ) : null}
        {g.summary.pending > 0 ? (
          <span className="installments-contract-stat installments-contract-stat--pending">
            <Clock size={14} aria-hidden />
            <strong>{g.summary.pending}</strong> a vencer
          </span>
        ) : null}
        {g.summary.overdue > 0 ? (
          <span className="installments-contract-stat installments-contract-stat--late">
            <AlertCircle size={14} aria-hidden />
            <strong>{g.summary.overdue}</strong> atrasadas
          </span>
        ) : null}
      </div>

      {g.summary.nextInstallment ? (
        <p className="installments-contract-next">
          Próximo vencimento:{' '}
          <strong>{formatInstallmentDate(g.summary.nextInstallment.dueDate)}</strong>{' '}
          · {formatInstallmentCurrency(g.summary.nextInstallment.amount)} em aberto
        </p>
      ) : null}

      <ul className="installments-parcel-preview" aria-label="Prévia das parcelas">
        {preview.map((entry) => (
          <li key={entry.id} className="installments-parcel-preview-item">
            <span className="installments-parcel-preview-date">
              {formatInstallmentDate(entry.dueDate)}
            </span>
            <span className="installments-parcel-preview-desc">{entry.description}</span>
            <span className="installments-parcel-preview-amount">
              {formatInstallmentCurrency(entry.amount)}
            </span>
            <InstallmentStatusBadge status={entry.status} />
          </li>
        ))}
      </ul>

      {remaining > 0 ? (
        <Link href={contratoHref} className="installments-contract-more">
          + {remaining} parcela{remaining === 1 ? '' : 's'} — abrir histórico
          completo
        </Link>
      ) : null}
    </article>
  )
}
