import { type Entry } from '@/lib/installments/entry-types'
import { INSTALLMENTS_CURRENT_MONTH } from './constants'
import { monthOfIso } from './format'
import type {
  InstallmentStatusFilter,
  InstallmentsContractGroup,
  InstallmentsSummaryStats,
} from './types'

export function getInstallmentStatusCounts(
  installments: Entry[],
): Record<InstallmentStatusFilter, number> {
  const counts: Record<InstallmentStatusFilter, number> = {
    all: installments.length,
    pending: 0,
    paid: 0,
    overdue: 0,
    cancelled: 0,
  }
  for (const entry of installments) counts[entry.status] += 1
  return counts
}

export function getInstallmentsSummaryStats(
  installments: Entry[],
): InstallmentsSummaryStats {
  const inMonth = installments.filter(
    (entry) =>
      monthOfIso(entry.dueDate) === INSTALLMENTS_CURRENT_MONTH &&
      entry.status !== 'cancelled',
  )
  const dueThisMonth = inMonth.reduce((sum, entry) => sum + entry.amount, 0)
  const received = installments
    .filter((entry) => entry.status === 'paid')
    .reduce((sum, entry) => sum + entry.amount, 0)
  const open = installments
    .filter((entry) => entry.status === 'pending' || entry.status === 'overdue')
    .reduce((sum, entry) => sum + entry.amount, 0)

  return { dueThisMonth, received, open }
}

export function filterInstallments(
  installments: Entry[],
  statusFilter: InstallmentStatusFilter,
  search: string,
): Entry[] {
  const q = search.trim().toLowerCase()

  return installments.filter((entry) => {
    if (statusFilter !== 'all' && entry.status !== statusFilter) return false
    if (!q) return true

    return (
      entry.contractCode.toLowerCase().includes(q) ||
      entry.propertyTitle.toLowerCase().includes(q) ||
      entry.propertyNeighborhood.toLowerCase().includes(q) ||
      entry.tenant.toLowerCase().includes(q) ||
      entry.description.toLowerCase().includes(q)
    )
  })
}

export function groupInstallmentsByContract(
  installments: Entry[],
): InstallmentsContractGroup[] {
  const map = new Map<string, InstallmentsContractGroup>()

  for (const entry of installments) {
    let group = map.get(entry.contractId)
    if (!group) {
      group = {
        contractId: entry.contractId,
        contractCode: entry.contractCode,
        propertyTitle: entry.propertyTitle,
        propertyNeighborhood: entry.propertyNeighborhood,
        tenant: entry.tenant,
        installments: [],
        summary: {
          total: 0,
          paid: 0,
          pending: 0,
          overdue: 0,
          cancelled: 0,
          openAmount: 0,
          nextInstallment: null,
        },
      }
      map.set(entry.contractId, group)
    }

    group.installments.push(entry)
    group.summary.total += 1
    if (entry.status === 'paid') group.summary.paid += 1
    else if (entry.status === 'pending') group.summary.pending += 1
    else if (entry.status === 'overdue') group.summary.overdue += 1
    else if (entry.status === 'cancelled') group.summary.cancelled += 1
  }

  for (const group of map.values()) {
    group.installments.sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    const open = group.installments.filter(
      (entry) => entry.status === 'pending' || entry.status === 'overdue',
    )
    group.summary.nextInstallment = open[0] ?? null
    group.summary.openAmount = open.reduce((sum, entry) => sum + entry.amount, 0)
  }

  return Array.from(map.values()).sort((a, b) => {
    if (a.summary.overdue !== b.summary.overdue) {
      return b.summary.overdue - a.summary.overdue
    }
    return a.contractCode.localeCompare(b.contractCode)
  })
}
