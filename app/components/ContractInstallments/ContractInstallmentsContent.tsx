'use client'

import {
  ArrowLeft,
  Building2,
  CalendarRange,
  CheckCircle2,
  Clock,
  TrendingDown,
  User,
  Wallet,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import type { Contract, ContractStatus } from '@/lib/contracts/types'
import type { Entry } from '@/lib/installments/entry-types'
import { formatInstallmentCurrency, formatInstallmentDate } from '@/lib/installments/format'
import { ContractInstallmentsGroup } from './ContractInstallmentsGroup'
import './contract-installments.css'

const statusLabel: Record<ContractStatus, string> = {
  active: 'Ativo',
  terminated: 'Rescindido',
  pending: 'Pendente',
}

export function ContractInstallmentsContent({
  contract,
  installments: installmentsProp,
}: {
  contract: Contract
  installments: Entry[]
}) {
  const installments = useMemo(
    () => [...installmentsProp].sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [installmentsProp],
  )

  const groups = useMemo(() => {
    const overdue = installments.filter((item) => item.status === 'overdue')
    const pending = installments.filter((item) => item.status === 'pending')
    const paid = installments.filter((item) => item.status === 'paid')
    const cancelled = installments.filter((item) => item.status === 'cancelled')
    return { overdue, pending, paid, cancelled }
  }, [installments])

  const totals = useMemo(() => {
    const overdueAmount = groups.overdue.reduce((sum, item) => sum + item.amount, 0)
    const pendingAmount = groups.pending.reduce((sum, item) => sum + item.amount, 0)
    const receivedAmount = groups.paid.reduce((sum, item) => sum + item.amount, 0)
    return { overdueAmount, pendingAmount, receivedAmount }
  }, [groups])

  return (
    <div className="contract-detail-page">
      <nav className="contract-detail-nav" aria-label="Voltar">
        <Link href="/financeiro/lancamentos" className="contract-detail-back">
          <ArrowLeft size={16} aria-hidden />
          Voltar para Installments
        </Link>
        <Link href="/locacao/contratos" className="contract-detail-back-secondary">
          Ver em Contratos
        </Link>
      </nav>

      <header className="contract-detail-header">
        <div className="contract-detail-header-main">
          <div className="contract-detail-property">
            <span className="contract-detail-property-icon">
              <Building2 size={24} />
            </span>
            <div>
              <h1 className="contract-detail-title">{contract.propertyTitle}</h1>
              <p className="contract-detail-neighborhood">{contract.propertyNeighborhood}</p>
            </div>
          </div>
          <span
            className={`contract-detail-badge contract-detail-badge--${contract.status}`}
          >
            {statusLabel[contract.status]}
          </span>
        </div>

        <dl className="contract-detail-meta">
          <div className="contract-detail-meta-item">
            <dt>
              <span className="contract-detail-meta-icon">
                <span aria-hidden>#</span>
              </span>
              Código
            </dt>
            <dd>{contract.code}</dd>
          </div>
          <div className="contract-detail-meta-item">
            <dt>
              <span className="contract-detail-meta-icon">
                <User size={14} />
              </span>
              Inquilino
            </dt>
            <dd>{contract.tenant}</dd>
          </div>
          <div className="contract-detail-meta-item">
            <dt>
              <span className="contract-detail-meta-icon">
                <User size={14} />
              </span>
              Proprietário
            </dt>
            <dd>{contract.owner}</dd>
          </div>
          <div className="contract-detail-meta-item">
            <dt>
              <span className="contract-detail-meta-icon">
                <Wallet size={14} />
              </span>
              Valor mensal
            </dt>
            <dd>{formatInstallmentCurrency(contract.monthlyAmount)}</dd>
          </div>
          <div className="contract-detail-meta-item">
            <dt>
              <span className="contract-detail-meta-icon">
                <CalendarRange size={14} />
              </span>
              Vigência
            </dt>
            <dd>
              {formatInstallmentDate(contract.startDate)}
              {contract.endDate ? ` — ${formatInstallmentDate(contract.endDate)}` : ' — em aberto'}
            </dd>
          </div>
        </dl>
      </header>

      <section className="contract-detail-section">
        <header className="contract-detail-section-head">
          <h2 className="contract-detail-section-title">
            Installments deste contrato
          </h2>
          <p className="contract-detail-section-desc">
            Histórico completo: o que já foi pago, o que ainda vai vencer e o que
            está em atraso. São {installments.length} parcela
            {installments.length === 1 ? '' : 's'} no total.
          </p>
        </header>

        <div className="contract-detail-quick-stats">
          <article className="contract-detail-quick-stat">
            <span className="contract-detail-quick-stat-icon contract-detail-quick-stat-icon--danger">
              <TrendingDown size={18} />
            </span>
            <div>
              <p className="contract-detail-quick-stat-label">Em atraso</p>
              <p className="contract-detail-quick-stat-value contract-detail-quick-stat-value--danger">
                {formatInstallmentCurrency(totals.overdueAmount)}
              </p>
              <p className="contract-detail-quick-stat-hint">
                {groups.overdue.length} parcela
                {groups.overdue.length === 1 ? '' : 's'}
              </p>
            </div>
          </article>
          <article className="contract-detail-quick-stat">
            <span className="contract-detail-quick-stat-icon contract-detail-quick-stat-icon--warning">
              <Clock size={18} />
            </span>
            <div>
              <p className="contract-detail-quick-stat-label">A vencer</p>
              <p className="contract-detail-quick-stat-value contract-detail-quick-stat-value--warning">
                {formatInstallmentCurrency(totals.pendingAmount)}
              </p>
              <p className="contract-detail-quick-stat-hint">
                {groups.pending.length} parcela
                {groups.pending.length === 1 ? '' : 's'}
              </p>
            </div>
          </article>
          <article className="contract-detail-quick-stat">
            <span className="contract-detail-quick-stat-icon contract-detail-quick-stat-icon--success">
              <CheckCircle2 size={18} />
            </span>
            <div>
              <p className="contract-detail-quick-stat-label">Recebidas</p>
              <p className="contract-detail-quick-stat-value contract-detail-quick-stat-value--success">
                {formatInstallmentCurrency(totals.receivedAmount)}
              </p>
              <p className="contract-detail-quick-stat-hint">
                {groups.paid.length} parcela
                {groups.paid.length === 1 ? '' : 's'}
              </p>
            </div>
          </article>
        </div>

        <ContractInstallmentsGroup
          title="Atrasadas"
          description="Já passaram do vencimento e ainda não foram pagas."
          tone="overdue"
          installments={groups.overdue}
        />
        <ContractInstallmentsGroup
          title="A vencer"
          description="Ainda não venceram — pagamento previsto para a data indicada."
          tone="pending"
          installments={groups.pending}
        />
        <ContractInstallmentsGroup
          title="Pagas"
          description="Installments já recebidas e registradas no sistema."
          tone="paid"
          installments={groups.paid}
        />
        {groups.cancelled.length > 0 ? (
          <ContractInstallmentsGroup
            title="Canceladas"
            description="Não serão mais cobradas."
            tone="cancelled"
            installments={groups.cancelled}
          />
        ) : null}
      </section>
    </div>
  )
}
