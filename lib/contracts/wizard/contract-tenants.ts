export type TenantRole = 'principal' | 'occupant' | 'guarantor'

export interface ContractTenantLink {
tenantId: string
role: TenantRole
}

export interface ContractTenantsData {
links: ContractTenantLink[]
}

export const defaultContractTenantsData = (): ContractTenantsData => ({
links: [],
})

export const TENANT_ROLE_OPTIONS: {
  value: TenantRole
  label: string
}[] = [
  { value: 'principal', label: 'Locatário principal' },
  { value: 'occupant', label: 'Morador' },
  { value: 'guarantor', label: 'Fiador' },
]

export function getPrincipalTenantId(
  data: ContractTenantsData,
): string | null {
  return data.links.find((v) => v.role === 'principal')?.tenantId ?? null
}

export function isContractTenantsValid(data: ContractTenantsData): boolean {
  return getPrincipalTenantId(data) !== null
}
