'use server'

import { ApiError } from '@/lib/api/client'
import { getAccessToken } from '@/lib/auth/cookies'
import {
  apiCreateInquilino,
  apiDeleteInquilino,
  apiListInquilinos,
  apiUpdateInquilino,
  mapInquilinoDtoToListRow,
} from '@/lib/inquilinos/api'
import type { InquilinoListRow, InquilinoUserFilters } from '@/lib/inquilinos/api'
import type { ProprietarioFormData } from '@/lib/proprietarios/types'

export type InquilinoActionState = {
  success: boolean
  error?: string
}

const BASE_FILTERS = {
  type: 'person' as const,
  is_renter: true,
}

function normalizeUserFilters(filters: InquilinoUserFilters): InquilinoUserFilters {
  return {
    city: filters.city?.trim() || undefined,
    state: filters.state?.trim().toUpperCase() || undefined,
    document: filters.document?.trim() || undefined,
    q: filters.q?.trim() || undefined,
  }
}

export async function fetchInquilinosAction(
  filters?: InquilinoUserFilters,
): Promise<InquilinoListRow[]> {
  const accessToken = await getAccessToken()
  if (!accessToken) return []

  const userFilters = normalizeUserFilters(filters ?? {})
  const apiFilters = { ...BASE_FILTERS, ...userFilters }

  try {
    const items = await apiListInquilinos(accessToken, apiFilters)
    return items.map(mapInquilinoDtoToListRow)
  } catch {
    return []
  }
}

export async function createInquilinoAction(
  data: ProprietarioFormData,
): Promise<InquilinoActionState> {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' }
  }

  try {
    await apiCreateInquilino(accessToken, data)
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao cadastrar inquilino.' }
  }
}

export async function updateInquilinoAction(
  personId: string,
  data: ProprietarioFormData,
): Promise<InquilinoActionState> {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' }
  }

  try {
    await apiUpdateInquilino(accessToken, personId, data)
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao atualizar inquilino.' }
  }
}

export async function deleteInquilinoAction(
  personId: string,
): Promise<InquilinoActionState> {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' }
  }

  try {
    await apiDeleteInquilino(accessToken, personId)
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao excluir inquilino.' }
  }
}
