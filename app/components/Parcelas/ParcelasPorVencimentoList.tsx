import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import {
  LANCAMENTO_TIPO_LABEL,
  type Lancamento,
} from '@/lib/mocks/lancamentos'
import { formatParcelaCurrency, formatParcelaDate } from '@/lib/parcelas/format'
import { ParcelaStatusBadge } from './ParcelaStatusBadge'

export interface ParcelasPorVencimentoListProps {
  parcelas: Lancamento[]
}

export function ParcelasPorVencimentoList({
  parcelas,
}: ParcelasPorVencimentoListProps) {
  if (parcelas.length === 0) {
    return (
      <p className="parc-empty">Nenhuma parcela encontrada com esses filtros.</p>
    )
  }

  return (
    <div className="parc-timeline">
      <ul className="parc-timeline-list">
        {parcelas.map((l) => (
          <li key={l.id} className="parc-timeline-item">
            <div className="parc-timeline-main">
              <time className="parc-timeline-date" dateTime={l.vencimento}>
                {formatParcelaDate(l.vencimento)}
              </time>
              <div className="parc-timeline-body">
                <p className="parc-timeline-desc">{l.descricao}</p>
                <p className="parc-timeline-meta">
                  {l.imovelTitulo} · {l.contratoCodigo} ·{' '}
                  {LANCAMENTO_TIPO_LABEL[l.tipo]}
                </p>
              </div>
              <div className="parc-timeline-end">
                <span className="parc-timeline-valor">
                  {formatParcelaCurrency(l.valor)}
                </span>
                <ParcelaStatusBadge status={l.status} />
              </div>
            </div>
            <Link
              href={`/locacao/contratos/${l.contratoId}`}
              className="parc-timeline-link"
            >
              Parcelas do contrato
              <ChevronRight size={16} aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
