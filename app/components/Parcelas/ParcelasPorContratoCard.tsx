import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import { formatParcelaCurrency, formatParcelaDate } from '@/lib/parcelas/format'
import type { ParcelasContratoGroup } from '@/lib/parcelas/types'
import { ParcelaStatusBadge } from './ParcelaStatusBadge'

const PREVIEW_LIMIT = 4

export interface ParcelasPorContratoCardProps {
  group: ParcelasContratoGroup
}

export function ParcelasPorContratoCard({ group }: ParcelasPorContratoCardProps) {
  const contratoHref = `/locacao/contratos/${group.contratoId}`
  const preview = group.parcelas.slice(0, PREVIEW_LIMIT)
  const restantes = group.parcelas.length - preview.length
  const g = group

  return (
    <article className="parc-contract-card">
      <header className="parc-contract-head">
        <div className="parc-contract-ident">
          <span className="parc-contract-icon" aria-hidden>
            <Building2 size={20} />
          </span>
          <div>
            <h3 className="parc-contract-title">{g.imovelTitulo}</h3>
            <p className="parc-contract-sub">
              Contrato <strong>{g.contratoCodigo}</strong> · {g.imovelBairro} ·
              Inquilino: {g.inquilino}
            </p>
          </div>
        </div>
        <Link href={contratoHref} className="parc-contract-cta">
          Ver todas as parcelas
          <ChevronRight size={18} aria-hidden />
        </Link>
      </header>

      <div className="parc-contract-stats">
        <span className="parc-contract-stat">
          <strong>{g.resumo.total}</strong> no total
        </span>
        {g.resumo.pagas > 0 ? (
          <span className="parc-contract-stat parc-contract-stat--paid">
            <CheckCircle2 size={14} aria-hidden />
            <strong>{g.resumo.pagas}</strong> pagas
          </span>
        ) : null}
        {g.resumo.pendentes > 0 ? (
          <span className="parc-contract-stat parc-contract-stat--pending">
            <Clock size={14} aria-hidden />
            <strong>{g.resumo.pendentes}</strong> a vencer
          </span>
        ) : null}
        {g.resumo.atrasadas > 0 ? (
          <span className="parc-contract-stat parc-contract-stat--late">
            <AlertCircle size={14} aria-hidden />
            <strong>{g.resumo.atrasadas}</strong> atrasadas
          </span>
        ) : null}
      </div>

      {g.resumo.proximaParcela ? (
        <p className="parc-contract-next">
          Próximo vencimento:{' '}
          <strong>{formatParcelaDate(g.resumo.proximaParcela.vencimento)}</strong>{' '}
          · {formatParcelaCurrency(g.resumo.proximaParcela.valor)} em aberto
        </p>
      ) : null}

      <ul className="parc-parcel-preview" aria-label="Prévia das parcelas">
        {preview.map((l) => (
          <li key={l.id} className="parc-parcel-preview-item">
            <span className="parc-parcel-preview-date">
              {formatParcelaDate(l.vencimento)}
            </span>
            <span className="parc-parcel-preview-desc">{l.descricao}</span>
            <span className="parc-parcel-preview-valor">
              {formatParcelaCurrency(l.valor)}
            </span>
            <ParcelaStatusBadge status={l.status} />
          </li>
        ))}
      </ul>

      {restantes > 0 ? (
        <Link href={contratoHref} className="parc-contract-more">
          + {restantes} parcela{restantes === 1 ? '' : 's'} — abrir histórico
          completo
        </Link>
      ) : null}
    </article>
  )
}
