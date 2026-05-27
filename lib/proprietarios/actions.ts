'use server'

import { ApiError } from '@/lib/api/client'
import { getAccessToken } from '@/lib/auth/cookies'
import {
  apiCreateProprietario,
  apiDeleteProprietario,
  apiUpdateProprietario,
} from '@/lib/proprietarios/api'
import type { ProprietarioFormData } from '@/lib/proprietarios/types'

export type ProprietarioActionState = {
  success: boolean
  error?: string
}

export async function createProprietarioAction(
  data: ProprietarioFormData,
): Promise<ProprietarioActionState> {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' }
  }

  try {
    await apiCreateProprietario(accessToken, data)
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao cadastrar proprietário.' }
  }
}

export async function updateProprietarioAction(
  personId: string,
  data: ProprietarioFormData,
): Promise<ProprietarioActionState> {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' }
  }

  try {
    await apiUpdateProprietario(accessToken, personId, data)
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao atualizar proprietário.' }
  }
}

export async function deleteProprietarioAction(
  personId: string,
): Promise<ProprietarioActionState> {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' }
  }

  try {
    await apiDeleteProprietario(accessToken, personId)
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao excluir proprietário.' }
  }
}
