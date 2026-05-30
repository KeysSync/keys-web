import { ENTRY_STATUS_LABEL } from '@/lib/installments/entry-types'
import type { EntryStatus } from '@/lib/installments/entry-types'

export interface InstallmentStatusBadgeProps {
  status: EntryStatus
}

export function InstallmentStatusBadge({ status }: InstallmentStatusBadgeProps) {
  return (
    <span className={`installments-badge installments-badge--${status}`}>
      {ENTRY_STATUS_LABEL[status]}
    </span>
  )
}
