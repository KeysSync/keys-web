import { apiFetch } from '@/lib/api/client'
import type { CondominiumFormData } from '@/lib/condominiums/types'

export interface CondominiumAddress {
  postal_code: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
}

export interface Condominium {
  id: string
  code: string
  name: string
  obs: string
  address: CondominiumAddress
}

export interface CondominiumListResponse {
  items: Condominium[]
  next_cursor: string | null
}

export interface CondominiumFilters {
  city?: string
  state?: string
  q?: string
}

function buildFilterQuery(filters?: CondominiumFilters): string {
  if (!filters) return ''
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value))
    }
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export function apiGetCondominiums(
  accessToken: string,
  filters?: CondominiumFilters,
): Promise<CondominiumListResponse> {
  return apiFetch<CondominiumListResponse>(
    `/condominiums/v1/${buildFilterQuery(filters)}`,
    {
      method: 'GET',
      bearer: accessToken,
    },
  )
}

export function apiCreateCondominium(
  accessToken: string,
  data: CondominiumFormData,
): Promise<Condominium> {
  return apiFetch<Condominium>('/condominiums/v1/', {
    method: 'POST',
    bearer: accessToken,
    json: data,
  })
}

export function apiGetCondominium(
  accessToken: string,
  condominiumId: string,
): Promise<Condominium> {
  return apiFetch<Condominium>(`/condominiums/v1/${condominiumId}`, {
    method: 'GET',
    bearer: accessToken,
  })
}

export function apiUpdateCondominium(
  accessToken: string,
  condominiumId: string,
  data: CondominiumFormData,
): Promise<Condominium> {
  return apiFetch<Condominium>(`/condominiums/v1/${condominiumId}`, {
    method: 'PUT',
    bearer: accessToken,
    json: data,
  })
}

export function apiDeleteCondominium(
  accessToken: string,
  condominiumId: string,
): Promise<void> {
  return apiFetch<void>(`/condominiums/v1/${condominiumId}`, {
    method: 'DELETE',
    bearer: accessToken,
  })
}
