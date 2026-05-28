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
import { notFound, useParams } from 'next/navigation'
import { useMemo } from 'react'
import { mockContratos, type ContratoStatus } from '@/lib/mocks/contratos'
import { mockLancamentos } from '@/lib/mocks/lancamentos'
import { formatParcelaCurrency, formatParcelaDate } from '@/lib/parcelas/format'
import { ContratoParcelasGrupo } from './ContratoParcelasGrupo'
import './contrato-parcelas.css'

const statusLabel: Record<ContratoStatus, string> = {
  ativo: 'Ativo',
  rescindido: 'Rescindido',
  pendente: 'Pendente',
}

export function ContratoParcelasContent() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const contrato = useMemo(
    () => mockContratos.find((c) => c.id === id),
    [id],
  )

  const parcelas = useMemo(
    () =>
      mockLancamentos
        .filter((l) => l.contratoId === id)
        .sort((a, b) => a.vencimento.localeCompare(b.vencimento)),
    [id],
  )

  const grupos = useMemo(() => {
    const atrasadas = parcelas.filter((p) => p.status === 'atrasado')
    const pendentes = parcelas.filter((p) => p.status === 'pendente')
    const pagas = parcelas.filter((p) => p.status === 'pago')
    const canceladas = parcelas.filter((p) => p.status === 'cancelado')
    return { atrasadas, pendentes, pagas, canceladas }
  }, [parcelas])

  const totais = useMemo(() => {
    const valorAtrasado = grupos.atrasadas.reduce((s, p) => s + p.valor, 0)
    const valorAVencer = grupos.pendentes.reduce((s, p) => s + p.valor, 0)
    const valorRecebido = grupos.pagas.reduce((s, p) => s + p.valor, 0)
    return { valorAtrasado, valorAVencer, valorRecebido }
  }, [grupos])

  if (!contrato) notFound()

  return (
    <div className="contrato-detail-page">
      <nav className="contrato-detail-nav" aria-label="Voltar">
        <Link href="/financeiro/lancamentos" className="contrato-detail-back">
          <ArrowLeft size={16} aria-hidden />
          Voltar para Parcelas
        </Link>
        <Link href="/locacao/contratos" className="contrato-detail-back-secondary">
          Ver em Contratos
        </Link>
      </nav>

      <header className="contrato-detail-header">
        <div className="contrato-detail-header-main">
          <div className="contrato-detail-imovel">
            <span className="contrato-detail-imovel-icon">
              <Building2 size={24} />
            </span>
            <div>
              <h1 className="contrato-detail-titulo">{contrato.imovelTitulo}</h1>
              <p className="contrato-detail-bairro">{contrato.imovelBairro}</p>
            </div>
          </div>
          <span
            className={`contrato-detail-badge contrato-detail-badge--${contrato.status}`}
          >
            {statusLabel[contrato.status]}
          </span>
        </div>

        <dl className="contrato-detail-meta">
          <div className="contrato-detail-meta-item">
            <dt>
              <span className="contrato-detail-meta-icon">
                <span aria-hidden>#</span>
              </span>
              Código
            </dt>
            <dd>{contrato.codigo}</dd>
          </div>
          <div className="contrato-detail-meta-item">
            <dt>
              <span className="contrato-detail-meta-icon">
                <User size={14} />
              </span>
              Inquilino
            </dt>
            <dd>{contrato.inquilino}</dd>
          </div>
          <div className="contrato-detail-meta-item">
            <dt>
              <span className="contrato-detail-meta-icon">
                <User size={14} />
              </span>
              Proprietário
            </dt>
            <dd>{contrato.proprietario}</dd>
          </div>
          <div className="contrato-detail-meta-item">
            <dt>
              <span className="contrato-detail-meta-icon">
                <Wallet size={14} />
              </span>
              Valor mensal
            </dt>
            <dd>{formatParcelaCurrency(contrato.valorMensal)}</dd>
          </div>
          <div className="contrato-detail-meta-item">
            <dt>
              <span className="contrato-detail-meta-icon">
                <CalendarRange size={14} />
              </span>
              Vigência
            </dt>
            <dd>
              {formatParcelaDate(contrato.inicio)}
              {contrato.fim ? ` — ${formatParcelaDate(contrato.fim)}` : ' — em aberto'}
            </dd>
          </div>
        </dl>
      </header>

      <section className="contrato-detail-section">
        <header className="contrato-detail-section-head">
          <h2 className="contrato-detail-section-title">
            Parcelas deste contrato
          </h2>
          <p className="contrato-detail-section-desc">
            Histórico completo: o que já foi pago, o que ainda vai vencer e o que
            está em atraso. São {parcelas.length} parcela
            {parcelas.length === 1 ? '' : 's'} no total.
          </p>
        </header>

        <div className="contrato-detail-quick-stats">
          <article className="contrato-detail-quick-stat">
            <span className="contrato-detail-quick-stat-icon contrato-detail-quick-stat-icon--danger">
              <TrendingDown size={18} />
            </span>
            <div>
              <p className="contrato-detail-quick-stat-label">Em atraso</p>
              <p className="contrato-detail-quick-stat-value contrato-detail-quick-stat-value--danger">
                {formatParcelaCurrency(totais.valorAtrasado)}
              </p>
              <p className="contrato-detail-quick-stat-hint">
                {grupos.atrasadas.length} parcela
                {grupos.atrasadas.length === 1 ? '' : 's'}
              </p>
            </div>
          </article>
          <article className="contrato-detail-quick-stat">
            <span className="contrato-detail-quick-stat-icon contrato-detail-quick-stat-icon--warning">
              <Clock size={18} />
            </span>
            <div>
              <p className="contrato-detail-quick-stat-label">A vencer</p>
              <p className="contrato-detail-quick-stat-value contrato-detail-quick-stat-value--warning">
                {formatParcelaCurrency(totais.valorAVencer)}
              </p>
              <p className="contrato-detail-quick-stat-hint">
                {grupos.pendentes.length} parcela
                {grupos.pendentes.length === 1 ? '' : 's'}
              </p>
            </div>
          </article>
          <article className="contrato-detail-quick-stat">
            <span className="contrato-detail-quick-stat-icon contrato-detail-quick-stat-icon--success">
              <CheckCircle2 size={18} />
            </span>
            <div>
              <p className="contrato-detail-quick-stat-label">Recebidas</p>
              <p className="contrato-detail-quick-stat-value contrato-detail-quick-stat-value--success">
                {formatParcelaCurrency(totais.valorRecebido)}
              </p>
              <p className="contrato-detail-quick-stat-hint">
                {grupos.pagas.length} parcela
                {grupos.pagas.length === 1 ? '' : 's'}
              </p>
            </div>
          </article>
        </div>

        <ContratoParcelasGrupo
          titulo="Atrasadas"
          descricao="Já passaram do vencimento e ainda não foram pagas."
          tom="atrasado"
          parcelas={grupos.atrasadas}
        />
        <ContratoParcelasGrupo
          titulo="A vencer"
          descricao="Ainda não venceram — pagamento previsto para a data indicada."
          tom="pendente"
          parcelas={grupos.pendentes}
        />
        <ContratoParcelasGrupo
          titulo="Pagas"
          descricao="Parcelas já recebidas e registradas no sistema."
          tom="pago"
          parcelas={grupos.pagas}
        />
        {grupos.canceladas.length > 0 ? (
          <ContratoParcelasGrupo
            titulo="Canceladas"
            descricao="Não serão mais cobradas."
            tom="cancelado"
            parcelas={grupos.canceladas}
          />
        ) : null}
      </section>
    </div>
  )
}
