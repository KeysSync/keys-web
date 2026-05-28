import { Building2, CalendarDays, Search } from 'lucide-react'
import { PARCELAS_STATUS_LABELS } from '@/lib/parcelas/constants'
import type { ParcelaStatusFilter, ParcelasViewMode } from '@/lib/parcelas/types'

export interface ParcelasToolbarProps {
  viewMode: ParcelasViewMode
  statusFilter: ParcelaStatusFilter
  statusCounts: Record<ParcelaStatusFilter, number>
  search: string
  onViewModeChange: (mode: ParcelasViewMode) => void
  onStatusFilterChange: (filter: ParcelaStatusFilter) => void
  onSearchChange: (value: string) => void
}

export function ParcelasToolbar({
  viewMode,
  statusFilter,
  statusCounts,
  search,
  onViewModeChange,
  onStatusFilterChange,
  onSearchChange,
}: ParcelasToolbarProps) {
  return (
    <div className="parc-toolbar">
      <div className="parc-toolbar-main">
        <div
          className="parc-view-toggle"
          role="tablist"
          aria-label="Visualização"
        >
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'vencimento'}
            className={`parc-view-btn${viewMode === 'vencimento' ? ' parc-view-btn--active' : ''}`}
            onClick={() => onViewModeChange('vencimento')}
          >
            <CalendarDays size={15} aria-hidden />
            Por vencimento
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'contrato'}
            className={`parc-view-btn${viewMode === 'contrato' ? ' parc-view-btn--active' : ''}`}
            onClick={() => onViewModeChange('contrato')}
          >
            <Building2 size={15} aria-hidden />
            Por contrato
          </button>
        </div>

        <div className="parc-tabs" role="tablist" aria-label="Situação">
          {(Object.keys(PARCELAS_STATUS_LABELS) as ParcelaStatusFilter[]).map(
            (key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={statusFilter === key}
                className={`parc-tab${statusFilter === key ? ' parc-tab--active' : ''}`}
                onClick={() => onStatusFilterChange(key)}
              >
                {PARCELAS_STATUS_LABELS[key]}
                <span className="parc-tab-count">{statusCounts[key]}</span>
              </button>
            ),
          )}
        </div>
      </div>

      <label className="parc-search-wrap">
        <Search size={18} className="parc-search-icon" aria-hidden />
        <input
          type="search"
          className="parc-search"
          placeholder="Buscar contrato, imóvel ou inquilino…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>
    </div>
  )
}
