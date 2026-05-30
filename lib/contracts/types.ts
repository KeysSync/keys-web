export type ContractStatus = 'active' | 'pending' | 'terminated'

export interface Contract {
  id: string
  code: string
  propertyTitle: string
  propertyNeighborhood: string
  tenant: string
  owner: string
  monthlyAmount: number
  startDate: string
  endDate: string | null
  status: ContractStatus
}
