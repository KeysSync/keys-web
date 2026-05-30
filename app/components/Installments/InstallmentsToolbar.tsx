import { Building2, CalendarDays, Search } from 'lucide-react'
import { INSTALLMENTS_STATUS_LABELS } from '@/lib/installments/constants'
import type { InstallmentStatusFilter, InstallmentsViewMode } from '@/lib/installments/types'

export interface InstallmentsToolbarProps {
  viewMode: InstallmentsViewMode
  statusFilter: InstallmentStatusFilter
  statusCounts: Record<InstallmentStatusFilter, number>
  search: string
  onViewModeChange: (mode: InstallmentsViewMode) => void
  onStatusFilterChange: (filter: InstallmentStatusFilter) => void
  onSearchChange: (value: string) => void
}

export function InstallmentsToolbar({
  viewMode,
  statusFilter,
  statusCounts,
  search,
  onViewModeChange,
  onStatusFilterChange,
  onSearchChange,
}: InstallmentsToolbarProps) {
  return (
    <div className="installments-toolbar">
      <div className="installments-toolbar-main">
        <div
          className="installments-view-toggle"
          role="tablist"
          aria-label="Visualização"
        >
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'dueDate'}
            className={`installments-view-btn${viewMode === 'dueDate' ? ' installments-view-btn--active' : ''}`}
            onClick={() => onViewModeChange('dueDate')}
          >
            <CalendarDays size={15} aria-hidden />
            Por vencimento
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'contract'}
            className={`installments-view-btn${viewMode === 'contract' ? ' installments-view-btn--active' : ''}`}
            onClick={() => onViewModeChange('contract')}
          >
            <Building2 size={15} aria-hidden />
            Por contrato
          </button>
        </div>

        <div className="installments-tabs" role="tablist" aria-label="Situação">
          {(Object.keys(INSTALLMENTS_STATUS_LABELS) as InstallmentStatusFilter[]).map(
            (key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={statusFilter === key}
                className={`installments-tab${statusFilter === key ? ' installments-tab--active' : ''}`}
                onClick={() => onStatusFilterChange(key)}
              >
                {INSTALLMENTS_STATUS_LABELS[key]}
                <span className="installments-tab-count">{statusCounts[key]}</span>
              </button>
            ),
          )}
        </div>
      </div>

      <label className="installments-search-wrap">
        <Search size={18} className="installments-search-icon" aria-hidden />
        <input
          type="search"
          className="installments-search"
          placeholder="Buscar contrato, imóvel ou inquilino…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>
    </div>
  )
}
