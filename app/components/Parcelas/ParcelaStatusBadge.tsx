import { LANCAMENTO_STATUS_LABEL } from '@/lib/mocks/lancamentos'
import type { LancamentoStatus } from '@/lib/mocks/lancamentos'

export interface ParcelaStatusBadgeProps {
  status: LancamentoStatus
}

export function ParcelaStatusBadge({ status }: ParcelaStatusBadgeProps) {
  return (
    <span className={`parc-badge parc-badge--${status}`}>
      {LANCAMENTO_STATUS_LABEL[status]}
    </span>
  )
}
