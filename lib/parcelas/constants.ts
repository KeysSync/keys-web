import type { ParcelaStatusFilter, ParcelasViewMode } from './types'

export const PARCELAS_CURRENT_MONTH = '2026-05'

export const PARCELAS_DEFAULT_VIEW_MODE: ParcelasViewMode = 'vencimento'

export const PARCELAS_DEFAULT_STATUS_FILTER: ParcelaStatusFilter = 'pendente'

export const PARCELAS_STATUS_LABELS: Record<ParcelaStatusFilter, string> = {
  todos: 'Todas',
  pendente: 'A vencer',
  pago: 'Pagas',
  atrasado: 'Atrasadas',
  cancelado: 'Canceladas',
}
