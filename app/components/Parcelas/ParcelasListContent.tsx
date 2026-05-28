'use client'

import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { mockLancamentos } from '@/lib/mocks/lancamentos'
import {
  PARCELAS_DEFAULT_STATUS_FILTER,
  PARCELAS_DEFAULT_VIEW_MODE,
} from '@/lib/parcelas/constants'
import type { ParcelaStatusFilter, ParcelasViewMode } from '@/lib/parcelas/types'
import {
  filterParcelas,
  getParcelaStatusCounts,
  getParcelasSummaryStats,
  groupParcelasByContrato,
} from '@/lib/parcelas/utils'
import { ParcelasPorContratoList } from './ParcelasPorContratoList'
import { ParcelasPorVencimentoList } from './ParcelasPorVencimentoList'
import { ParcelasSummary } from './ParcelasSummary'
import { ParcelasToolbar } from './ParcelasToolbar'
import './parcelas.css'

export function ParcelasListContent() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ParcelaStatusFilter>(
    PARCELAS_DEFAULT_STATUS_FILTER,
  )
  const [viewMode, setViewMode] = useState<ParcelasViewMode>(
    PARCELAS_DEFAULT_VIEW_MODE,
  )

  const statusCounts = useMemo(() => getParcelaStatusCounts(), [])
  const stats = useMemo(() => getParcelasSummaryStats(), [])

  const filtered = useMemo(
    () => filterParcelas(mockLancamentos, statusFilter, search),
    [search, statusFilter],
  )

  const grouped = useMemo(() => groupParcelasByContrato(filtered), [filtered])

  const porVencimento = useMemo(
    () => [...filtered].sort((a, b) => a.vencimento.localeCompare(b.vencimento)),
    [filtered],
  )

  return (
    <div className="parc-page">
      <header className="parc-hero">
        <div className="parc-hero-text">
          <h1 className="parc-title">Parcelas</h1>
          <p className="parc-lead">
            Consulte pagamentos, vencimentos e valores por contrato ou por data.
          </p>
        </div>
        <div className="parc-hero-actions">
          <button type="button" className="parc-btn-primary">
            <Plus size={18} aria-hidden />
            Nova parcela
          </button>
        </div>
      </header>

      <ParcelasSummary stats={stats} />

      <section className="parc-panel">
        <ParcelasToolbar
          viewMode={viewMode}
          statusFilter={statusFilter}
          statusCounts={statusCounts}
          search={search}
          onViewModeChange={setViewMode}
          onStatusFilterChange={setStatusFilter}
          onSearchChange={setSearch}
        />

        {viewMode === 'contrato' ? (
          <ParcelasPorContratoList groups={grouped} />
        ) : (
          <ParcelasPorVencimentoList parcelas={porVencimento} />
        )}

        <footer className="parc-footer">
          {viewMode === 'contrato'
            ? `${grouped.length} contrato${grouped.length === 1 ? '' : 's'} · ${filtered.length} parcela${filtered.length === 1 ? '' : 's'}`
            : `${filtered.length} parcela${filtered.length === 1 ? '' : 's'} por vencimento`}
        </footer>
      </section>
    </div>
  )
}
