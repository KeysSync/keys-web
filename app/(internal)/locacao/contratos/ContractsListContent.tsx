'use client'

import { markContractCreateEntry } from '@/lib/contracts/wizard/draft'
import type { Contract, ContractStatus } from '@/lib/contracts/types'
import {
  ArrowDownUp,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Filter,
  Plus,
  Search,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import './style.css'

const statusBadgeClass: Record<ContractStatus, string> = {
  active: 'ativo',
  pending: 'pendente',
  terminated: 'rescindido',
}

const statusLabel: Record<ContractStatus, string> = {
  active: 'Ativo',
  terminated: 'Rescindido',
  pending: 'Pendente',
}

type StatusFilter = 'all' | ContractStatus

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR')
}

export function ContractsListContent({ contracts }: { contracts: Contract[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const stats = useMemo(() => {
    const active = contracts.filter((c) => c.status === 'active')
    const activeRevenue = active.reduce((sum, c) => sum + c.monthlyAmount, 0)

    return {
      total: contracts.length,
      active: active.length,
      pending: contracts.filter((c) => c.status === 'pending').length,
      terminated: contracts.filter((c) => c.status === 'terminated').length,
      activeRevenue,
    }
  }, [contracts])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    return contracts.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false
      if (!q) return true

      return (
        c.code.toLowerCase().includes(q) ||
        c.propertyTitle.toLowerCase().includes(q) ||
        c.propertyNeighborhood.toLowerCase().includes(q) ||
        c.tenant.toLowerCase().includes(q) ||
        c.owner.toLowerCase().includes(q)
      )
    })
  }, [contracts, search, statusFilter])

  return (
    <div className="contracts-page">
      <header className="contracts-hero">
        <div className="contracts-hero-text">
          <p className="contracts-page-desc">
            Acompanhe o status, valores e prazos de todos os contratos ativos da
            sua carteira.
          </p>
        </div>
        <div className="contracts-hero-actions">
          <button type="button" className="contratos-btn-outline">
            <Download size={18} />
            Exportar
          </button>
          <Link
            href="/locacao/contratos/criar"
            className="contratos-btn-primary"
            onClick={() => markContractCreateEntry()}
          >
            <Plus size={18} />
            Novo contrato
          </Link>
        </div>
      </header>

      <div className="contratos-stats">
        <article className="contratos-stat-card">
          <div className="contratos-stat-icon contratos-stat-icon--info">
            <FileText size={22} />
          </div>
          <div>
            <p className="contratos-stat-label">Total de contratos</p>
            <p className="contratos-stat-value">{stats.total}</p>
            <p className="contratos-stat-hint">Carteira completa</p>
          </div>
        </article>
        <article className="contratos-stat-card">
          <div className="contratos-stat-icon contratos-stat-icon--success">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="contratos-stat-label">Ativos</p>
            <p className="contratos-stat-value contratos-stat-value--success">
              {stats.active}
            </p>
            <p className="contratos-stat-hint">
              Receita {formatCurrency(stats.activeRevenue)}/mês
            </p>
          </div>
        </article>
        <article className="contratos-stat-card">
          <div className="contratos-stat-icon contratos-stat-icon--warning">
            <Clock size={22} />
          </div>
          <div>
            <p className="contratos-stat-label">Pendentes</p>
            <p className="contratos-stat-value contratos-stat-value--warning">
              {stats.pending}
            </p>
            <p className="contratos-stat-hint">Aguardando assinatura</p>
          </div>
        </article>
        <article className="contratos-stat-card">
          <div className="contratos-stat-icon contratos-stat-icon--danger">
            <XCircle size={22} />
          </div>
          <div>
            <p className="contratos-stat-label">Rescindidos</p>
            <p className="contratos-stat-value contratos-stat-value--danger">
              {stats.terminated}
            </p>
            <p className="contratos-stat-hint">Encerrados</p>
          </div>
        </article>
      </div>

      <section className="contratos-panel">
        <div className="contratos-toolbar">
          <div className="contratos-tabs" role="tablist" aria-label="Status">
            {(
              [
                ['all', 'Todos'],
                ['active', 'Ativos'],
                ['pending', 'Pendentes'],
                ['terminated', 'Rescindidos'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={statusFilter === key}
                className={`contratos-tab${statusFilter === key ? ' contratos-tab--active' : ''}`}
                onClick={() => setStatusFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="contratos-toolbar-right">
            <label className="contratos-search-wrap">
              <Search size={18} className="contratos-search-icon" aria-hidden />
              <input
                type="search"
                className="contratos-search"
                placeholder="Buscar contrato, imóvel ou pessoa…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <button
              type="button"
              className="contratos-btn-outline contratos-btn-filter"
            >
              <Filter size={18} />
              Filtros
            </button>
          </div>
        </div>

        <div className="contratos-table-wrap">
          <table className="contratos-table">
            <thead>
              <tr>
                <th>
                  Código <ArrowDownUp size={14} />
                </th>
                <th>
                  Imóvel <ArrowDownUp size={14} />
                </th>
                <th>
                  Inquilino <ArrowDownUp size={14} />
                </th>
                <th>
                  Proprietário <ArrowDownUp size={14} />
                </th>
                <th>
                  Valor <ArrowDownUp size={14} />
                </th>
                <th>
                  Vigência <ArrowDownUp size={14} />
                </th>
                <th className="contratos-col-status">
                  <span className="contratos-col-status-head">
                    Status
                    <ArrowDownUp size={14} aria-hidden />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="contratos-empty">
                    Nenhum contrato encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((contract) => (
                  <tr key={contract.id}>
                    <td>
                      <Link
                        href={`/locacao/contratos/${contract.id}`}
                        className="contratos-code"
                      >
                        {contract.code}
                      </Link>
                    </td>
                    <td>
                      <div className="contratos-imovel">
                        <span className="contratos-imovel-icon">
                          <Building2 size={16} />
                        </span>
                        <span>
                          <span className="contratos-imovel-titulo">
                            {contract.propertyTitle}
                          </span>
                          <span className="contratos-imovel-bairro">
                            {contract.propertyNeighborhood}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td>{contract.tenant}</td>
                    <td>{contract.owner}</td>
                    <td className="contratos-valor">
                      {formatCurrency(contract.monthlyAmount)}
                    </td>
                    <td>
                      <div className="contratos-vigencia">
                        <span>{formatDate(contract.startDate)}</span>
                        <span className="contratos-vigencia-sep">até</span>
                        <span>
                          {contract.endDate ? formatDate(contract.endDate) : '—'}
                        </span>
                      </div>
                    </td>
                    <td className="contratos-col-status">
                      <span
                        className={`contratos-badge contratos-badge--${statusBadgeClass[contract.status]}`}
                      >
                        {statusLabel[contract.status]}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="contratos-footer">
          <p className="contratos-footer-count">
            <TrendingUp size={16} className="contratos-footer-icon" />
            {filtered.length === contracts.length
              ? `${contracts.length} contratos`
              : `Mostrando ${filtered.length} de ${contracts.length} contratos`}
          </p>
        </footer>
      </section>
    </div>
  )
}
