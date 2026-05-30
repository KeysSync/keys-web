import type { InstallmentStatusFilter, InstallmentsViewMode } from './types'

export const INSTALLMENTS_CURRENT_MONTH = '2026-05'

export const INSTALLMENTS_DEFAULT_VIEW_MODE: InstallmentsViewMode = 'dueDate'

export const INSTALLMENTS_DEFAULT_STATUS_FILTER: InstallmentStatusFilter = 'pending'

export const INSTALLMENTS_STATUS_LABELS: Record<InstallmentStatusFilter, string> = {
  all: 'Todas',
  pending: 'A vencer',
  paid: 'Pagas',
  overdue: 'Atrasadas',
  cancelled: 'Canceladas',
}
