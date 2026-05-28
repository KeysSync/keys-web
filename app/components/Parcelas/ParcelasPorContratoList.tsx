import type { ParcelasContratoGroup } from '@/lib/parcelas/types'
import { ParcelasPorContratoCard } from './ParcelasPorContratoCard'

export interface ParcelasPorContratoListProps {
  groups: ParcelasContratoGroup[]
}

export function ParcelasPorContratoList({ groups }: ParcelasPorContratoListProps) {
  if (groups.length === 0) {
    return (
      <p className="parc-empty">Nenhuma parcela encontrada com esses filtros.</p>
    )
  }

  return (
    <div className="parc-contract-list">
      {groups.map((g) => (
        <ParcelasPorContratoCard key={g.contratoId} group={g} />
      ))}
    </div>
  )
}
