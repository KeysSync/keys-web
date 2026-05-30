import type { Entry, EntryStatus } from '@/lib/installments/entry-types'

export type InstallmentStatusFilter = 'all' | EntryStatus

export type InstallmentsViewMode = 'contract' | 'dueDate'

export interface InstallmentsContractGroup {
  contractId: string
  contractCode: string
  propertyTitle: string
  propertyNeighborhood: string
  tenant: string
  installments: Entry[]
  summary: {
    total: number
    paid: number
    pending: number
    overdue: number
    cancelled: number
    openAmount: number
    nextInstallment: Entry | null
  }
}

export interface InstallmentsSummaryStats {
  dueThisMonth: number
  received: number
  open: number
}
