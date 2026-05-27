import 'server-only'

import { getAccessToken } from '@/lib/auth/cookies'
import {
  apiGetCondominium,
  apiGetCondominiums,
  type Condominium,
  type CondominiumFilters,
} from '@/lib/condominiums/api'
import { cache } from 'react'

export const getCondominiums = cache(
  async (filters?: CondominiumFilters): Promise<Condominium[]> => {
    const accessToken = await getAccessToken()
    if (!accessToken) return []

    try {
      const response = await apiGetCondominiums(accessToken, filters)
      return response.items
    } catch {
      return []
    }
  },
)

export const getCondominiumById = cache(
  async (condominiumId: string): Promise<Condominium | null> => {
    const accessToken = await getAccessToken()
    if (!accessToken) return null

    try {
      return await apiGetCondominium(accessToken, condominiumId)
    } catch {
      return null
    }
  },
)
