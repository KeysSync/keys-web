import type { InstallmentsContractGroup } from '@/lib/installments/types'
import { InstallmentsByContractCard } from './InstallmentsByContractCard'

export interface InstallmentsByContractListProps {
  groups: InstallmentsContractGroup[]
}

export function InstallmentsByContractList({ groups }: InstallmentsByContractListProps) {
  if (groups.length === 0) {
    return (
      <p className="installments-empty">Nenhuma parcela encontrada com esses filtros.</p>
    )
  }

  return (
    <div className="installments-contract-list">
      {groups.map((g) => (
        <InstallmentsByContractCard key={g.contractId} group={g} />
      ))}
    </div>
  )
}
