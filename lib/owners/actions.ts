'use server'

import { ApiError } from '@/lib/api/client'
import { getAccessToken } from '@/lib/auth/cookies'
import {
  apiCreateOwner,
  apiDeleteOwner,
  apiUpdateOwner,
} from '@/lib/owners/api'
import type { OwnerFormData } from '@/lib/owners/types'

export type OwnerActionState = {
  success: boolean
  error?: string
}

export async function createOwnerAction(
  data: OwnerFormData,
): Promise<OwnerActionState> {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' }
  }

  try {
    await apiCreateOwner(accessToken, data)
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao cadastrar proprietário.' }
  }
}

export async function updateOwnerAction(
  personId: string,
  data: OwnerFormData,
): Promise<OwnerActionState> {
  console.log('[updateOwnerAction] personId:', personId, 'data:', data)
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' }
  }

  try {
    await apiUpdateOwner(accessToken, personId, data)
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao atualizar proprietário.' }
  }
}

export async function deleteOwnerAction(
  personId: string,
): Promise<OwnerActionState> {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' }
  }

  try {
    await apiDeleteOwner(accessToken, personId)
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao excluir proprietário.' }
  }
}
