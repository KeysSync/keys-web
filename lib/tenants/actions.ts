'use server'

import { ApiError } from '@/lib/api/client'
import { getAccessToken } from '@/lib/auth/cookies'
import {
  apiCreateTenant,
  apiDeleteTenant,
  apiListTenants,
  apiUpdateTenant,
  mapTenantDtoToListRow,
} from '@/lib/tenants/api'
import type { TenantListRow, TenantUserFilters } from '@/lib/tenants/api'
import type { OwnerFormData } from '@/lib/owners/types'

export type TenantActionState = {
  success: boolean
  error?: string
}

const BASE_FILTERS = {
  type: 'person' as const,
  is_renter: true,
}

function normalizeUserFilters(filters: TenantUserFilters): TenantUserFilters {
  return {
    city: filters.city?.trim() || undefined,
    state: filters.state?.trim().toUpperCase() || undefined,
    document: filters.document?.trim() || undefined,
    q: filters.q?.trim() || undefined,
  }
}

export async function fetchInquilinosAction(
  filters?: TenantUserFilters,
): Promise<TenantListRow[]> {
  const accessToken = await getAccessToken()
  if (!accessToken) return []

  const userFilters = normalizeUserFilters(filters ?? {})
  const apiFilters = { ...BASE_FILTERS, ...userFilters }

  try {
    const items = await apiListTenants(accessToken, apiFilters)
    return items.map(mapTenantDtoToListRow)
  } catch {
    return []
  }
}

export async function createTenantAction(
  data: OwnerFormData,
): Promise<TenantActionState> {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' }
  }

  try {
    await apiCreateTenant(accessToken, data)
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao cadastrar inquilino.' }
  }
}

export async function updateTenantAction(
  personId: string,
  data: OwnerFormData,
): Promise<TenantActionState> {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' }
  }

  try {
    await apiUpdateTenant(accessToken, personId, data)
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao atualizar inquilino.' }
  }
}

export async function deleteTenantAction(
  personId: string,
): Promise<TenantActionState> {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' }
  }

  try {
    await apiDeleteTenant(accessToken, personId)
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao excluir inquilino.' }
  }
}
