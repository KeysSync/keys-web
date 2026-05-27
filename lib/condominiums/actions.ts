'use server'

import { ApiError } from '@/lib/api/client'
import { getAccessToken } from '@/lib/auth/cookies'
import {
  apiCreateCondominium,
  apiDeleteCondominium,
  apiGetCondominiums,
  apiUpdateCondominium,
  type Condominium,
  type CondominiumFilters,
} from '@/lib/condominiums/api'
import type { CondominiumFormData } from '@/lib/condominiums/types'

export type CondominiumActionState = {
  success: boolean
  error?: string
}

export async function createCondominiumAction(
  data: CondominiumFormData,
): Promise<CondominiumActionState> {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' }
  }

  try {
    await apiCreateCondominium(accessToken, data)
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao cadastrar condomínio.' }
  }
}

export async function updateCondominiumAction(
  condominiumId: string,
  data: CondominiumFormData,
): Promise<CondominiumActionState> {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' }
  }

  try {
    await apiUpdateCondominium(accessToken, condominiumId, data)
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao atualizar condomínio.' }
  }
}

export async function deleteCondominiumAction(
  condominiumId: string,
): Promise<CondominiumActionState> {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' }
  }

  try {
    await apiDeleteCondominium(accessToken, condominiumId)
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao excluir condomínio.' }
  }
}

export async function fetchCondominiumsAction(
  filters?: CondominiumFilters,
): Promise<Condominium[]> {
  const accessToken = await getAccessToken()
  if (!accessToken) return []

  try {
    const response = await apiGetCondominiums(accessToken, filters)
    return response.items
  } catch {
    return []
  }
}
