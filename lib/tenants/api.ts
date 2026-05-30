import { apiFetch } from '@/lib/api/client'
import {
  apiGetPerson,
  buildPersonPayload,
  personDtoToFormData,
  type OwnerWritePayload,
} from '@/lib/owners/api'
import type { OwnerFormData } from '@/lib/owners/types'
import { onlyDigits } from '@/lib/utils/validation'

export { apiGetPerson, personDtoToFormData }

export function buildTenantPayload(
  data: OwnerFormData,
): OwnerWritePayload {
  const payload = buildPersonPayload({ ...data, is_renter: true })
  return { ...payload, roles: ['renter'] }
}

export interface TenantListFilters {
  type?: 'person' | 'enterprise'
  is_renter?: boolean
  city?: string
  state?: string
  document?: string
  q?: string
}

export type TenantUserFilters = Pick<
  TenantListFilters,
  'city' | 'state' | 'document' | 'q'
>

export interface TenantPersonDto {
  id: string
  name?: string
  email?: string
  document?: string
  type?: 'person' | 'enterprise'
  phones?: Array<{ number?: string }>
}

export interface TenantListRow {
  id: string
  name: string
  document: string
  type: 'pf' | 'pj'
  email: string
  phone: string
}

function normalizePersonsList(raw: unknown): TenantPersonDto[] {
  if (Array.isArray(raw)) return raw as TenantPersonDto[]
  if (raw && typeof raw === 'object') {
    const data = raw as { items?: TenantPersonDto[]; results?: TenantPersonDto[] }
    if (Array.isArray(data.items)) return data.items
    if (Array.isArray(data.results)) return data.results
  }
  return []
}

function buildFilterQuery(filters: TenantListFilters): string {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '') continue
    if (typeof value === 'boolean') {
      params.set(key, value ? 'true' : 'false')
      continue
    }
    if (key === 'document') {
      params.set(key, onlyDigits(String(value)))
      continue
    }
    params.set(key, String(value))
  }

  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export function mapTenantDtoToListRow(p: TenantPersonDto): TenantListRow {
  const doc = p.document ?? ''
  const digits = onlyDigits(doc)
  const type: TenantListRow['type'] =
    p.type === 'enterprise' || digits.length > 11 ? 'pj' : 'pf'

  return {
    id: p.id,
    name: p.name ?? '',
    document: doc,
    type,
    email: p.email ?? '',
    phone: p.phones?.find((ph) => ph.number?.trim())?.number ?? '',
  }
}

export function apiListTenants(
  accessToken: string,
  filters: TenantListFilters,
): Promise<TenantPersonDto[]> {
  return apiFetch<unknown>(`/persons/v1/${buildFilterQuery(filters)}`, {
    method: 'GET',
    bearer: accessToken,
  }).then(normalizePersonsList)
}

export function apiCreateTenant(
  accessToken: string,
  data: OwnerFormData,
): Promise<void> {
  return apiFetch<void>('/persons/v1/', {
    method: 'POST',
    bearer: accessToken,
    json: buildTenantPayload(data),
  })
}

export function apiUpdateTenant(
  accessToken: string,
  personId: string,
  data: OwnerFormData,
): Promise<void> {
  return apiFetch<void>(`/persons/v1/${personId}`, {
    method: 'PUT',
    bearer: accessToken,
    json: buildTenantPayload(data),
  })
}

export function apiDeleteTenant(
  accessToken: string,
  personId: string,
): Promise<void> {
  return apiFetch<void>(`/persons/v1/${personId}`, {
    method: 'DELETE',
    bearer: accessToken,
  })
}
