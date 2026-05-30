import type { Property as ApiProperty } from '@/lib/properties/api'

export type ContractPropertyStatus = 'available' | 'rented' | 'maintenance'
export type ContractPropertyType = 'residential' | 'commercial'

export interface ContractPropertySummary {
  id: string
  code: string
  systemRef: string
  agencyRef: string
  street: string
  title: string
  neighborhood: string
  city: string
  type: ContractPropertyType
  status: ContractPropertyStatus
  rentAmount: number
  ownerName: string
}

const API_STATUS_MAP: Record<ApiProperty['status'], ContractPropertyStatus> = {
  available: 'available',
  rented: 'rented',
  repairing: 'maintenance',
}

export function mapApiPropertyToContractSummary(
  property: ApiProperty,
): ContractPropertySummary {
  const streetLine = [property.address.street, property.address.number]
    .filter(Boolean)
    .join(', ')

  const rentAmount = Number.parseFloat(property.rent_price) || 0

  return {
    id: property.id,
    code: property.code,
    systemRef: property.code,
    agencyRef: property.code,
    street: streetLine,
    title: property.code,
    neighborhood: property.address.neighborhood,
    city: property.address.city,
    type: 'residential',
    status: API_STATUS_MAP[property.status] ?? 'available',
    rentAmount,
    ownerName: '',
  }
}
