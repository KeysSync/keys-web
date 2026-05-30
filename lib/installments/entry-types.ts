export type EntryStatus = 'pending' | 'paid' | 'overdue' | 'cancelled'

export type EntryType =
  | 'rent'
  | 'condo'
  | 'iptu'
  | 'water'
  | 'power'
  | 'gas'
  | 'admin_fee'
  | 'multa'
  | 'other'

export interface Entry {
  id: string
  contractId: string
  contractCode: string
  propertyTitle: string
  propertyNeighborhood: string
  tenant: string
  owner: string
  type: EntryType
  description: string
  amount: number
  dueDate: string
  paidAt: string | null
  status: EntryStatus
}

export const ENTRY_TYPE_LABEL: Record<EntryType, string> = {
  rent: 'Aluguel',
  condo: 'Condomínio',
  iptu: 'IPTU',
  water: 'Água',
  power: 'Energia',
  gas: 'Gás',
  admin_fee: 'Taxa de adm.',
  multa: 'Multa',
  other: 'Outro',
}

export const ENTRY_STATUS_LABEL: Record<EntryStatus, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  overdue: 'Atrasado',
  cancelled: 'Cancelado',
}
