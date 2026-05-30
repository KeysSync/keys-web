'use client'

import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Entry } from '@/lib/installments/entry-types'
import {
  INSTALLMENTS_DEFAULT_STATUS_FILTER,
  INSTALLMENTS_DEFAULT_VIEW_MODE,
} from '@/lib/installments/constants'
import type { InstallmentStatusFilter, InstallmentsViewMode } from '@/lib/installments/types'
import {
  filterInstallments,
  getInstallmentStatusCounts,
  getInstallmentsSummaryStats,
  groupInstallmentsByContract,
} from '@/lib/installments/utils'
import { InstallmentsByContractList } from './InstallmentsByContractList'
import { InstallmentsByDueDateList } from './InstallmentsByDueDateList'
import { InstallmentsSummary } from './InstallmentsSummary'
import { InstallmentsToolbar } from './InstallmentsToolbar'
import './installments.css'

export function InstallmentsListContent({
  installments,
}: {
  installments: Entry[]
}) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<InstallmentStatusFilter>(
    INSTALLMENTS_DEFAULT_STATUS_FILTER,
  )
  const [viewMode, setViewMode] = useState<InstallmentsViewMode>(
    INSTALLMENTS_DEFAULT_VIEW_MODE,
  )

  const statusCounts = useMemo(() => getInstallmentStatusCounts(installments), [installments])
  const stats = useMemo(() => getInstallmentsSummaryStats(installments), [installments])

  const filtered = useMemo(
    () => filterInstallments(installments, statusFilter, search),
    [installments, search, statusFilter],
  )

  const grouped = useMemo(() => groupInstallmentsByContract(filtered), [filtered])

  const byDueDate = useMemo(
    () => [...filtered].sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [filtered],
  )

  return (
    <div className="installments-page">
      <header className="installments-hero">
        <div className="installments-hero-text">
          <h1 className="installments-title">Installments</h1>
          <p className="installments-lead">
            Consulte pagamentos, vencimentos e valores por contrato ou por data.
          </p>
        </div>
        <div className="installments-hero-actions">
          <button type="button" className="installments-btn-primary">
            <Plus size={18} aria-hidden />
            Nova parcela
          </button>
        </div>
      </header>

      <InstallmentsSummary stats={stats} />

      <section className="installments-panel">
        <InstallmentsToolbar
          viewMode={viewMode}
          statusFilter={statusFilter}
          statusCounts={statusCounts}
          search={search}
          onViewModeChange={setViewMode}
          onStatusFilterChange={setStatusFilter}
          onSearchChange={setSearch}
        />

        {viewMode === 'contract' ? (
          <InstallmentsByContractList groups={grouped} />
        ) : (
          <InstallmentsByDueDateList installments={byDueDate} />
        )}

        <footer className="installments-footer">
          {viewMode === 'contract'
            ? `${grouped.length} contrato${grouped.length === 1 ? '' : 's'} · ${filtered.length} parcela${filtered.length === 1 ? '' : 's'}`
            : `${filtered.length} parcela${filtered.length === 1 ? '' : 's'} por vencimento`}
        </footer>
      </section>
    </div>
  )
}
