import {
  LANCAMENTO_STATUS_LABEL,
  LANCAMENTO_TIPO_LABEL,
  type Lancamento,
} from '@/lib/mocks/lancamentos'
import { formatParcelaCurrency, formatParcelaDate } from '@/lib/parcelas/format'

export interface ContratoParcelasGrupoProps {
  titulo: string
  descricao: string
  tom: 'atrasado' | 'pendente' | 'pago' | 'cancelado'
  parcelas: Lancamento[]
}

export function ContratoParcelasGrupo({
  titulo,
  descricao,
  tom,
  parcelas,
}: ContratoParcelasGrupoProps) {
  if (parcelas.length === 0) return null

  const total = parcelas.reduce((s, p) => s + p.valor, 0)

  return (
    <section className="contrato-detail-grupo">
      <header
        className={`contrato-detail-grupo-head contrato-detail-grupo-head--${tom}`}
      >
        <span className="contrato-detail-grupo-title-wrap">
          <span className="contrato-detail-grupo-title">
            <span
              className={`contrato-detail-grupo-dot contrato-detail-grupo-dot--${tom}`}
              aria-hidden
            />
            {titulo}
          </span>
          <span className="contrato-detail-grupo-desc">{descricao}</span>
        </span>
        <span className="contrato-detail-grupo-info">
          {parcelas.length} parcela{parcelas.length === 1 ? '' : 's'} ·{' '}
          {formatParcelaCurrency(total)}
        </span>
      </header>

      <table className="contrato-detail-table">
        <thead>
          <tr>
            <th>Vencimento</th>
            <th>Descrição</th>
            <th>Tipo</th>
            <th className="contrato-detail-col-valor">Valor</th>
            <th className="contrato-detail-col-status">Status</th>
          </tr>
        </thead>
        <tbody>
          {parcelas.map((l) => (
            <tr key={l.id}>
              <td>
                <div className="contrato-detail-vencimento">
                  <span className="contrato-detail-vencimento-date">
                    {formatParcelaDate(l.vencimento)}
                  </span>
                  {l.pagoEm ? (
                    <span className="contrato-detail-vencimento-paid">
                      pago em {formatParcelaDate(l.pagoEm)}
                    </span>
                  ) : null}
                </div>
              </td>
              <td>{l.descricao}</td>
              <td>
                <span
                  className={`contrato-detail-tipo contrato-detail-tipo--${l.tipo}`}
                >
                  {LANCAMENTO_TIPO_LABEL[l.tipo]}
                </span>
              </td>
              <td className="contrato-detail-col-valor contrato-detail-valor">
                {formatParcelaCurrency(l.valor)}
              </td>
              <td className="contrato-detail-col-status">
                <span
                  className={`contrato-detail-badge-parcela contrato-detail-badge-parcela--${l.status}`}
                >
                  {LANCAMENTO_STATUS_LABEL[l.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
