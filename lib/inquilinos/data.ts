import 'server-only'

import { cache } from 'react'
import { getAccessToken } from '@/lib/auth/cookies'
import {
  apiGetPerson,
  apiListInquilinos,
  mapInquilinoDtoToListRow,
  personDtoToFormData,
  type InquilinoListFilters,
  type InquilinoListRow,
} from '@/lib/inquilinos/api'
import type { ProprietarioFormData } from '@/lib/proprietarios/types'

const DEFAULT_INQUILINO_FILTERS: InquilinoListFilters = {
  type: 'person',
  is_renter: true,
}

export const getInquilinosList = cache(async (): Promise<InquilinoListRow[]> => {
  const accessToken = await getAccessToken()
  if (!accessToken) return []

  try {
    const items = await apiListInquilinos(accessToken, DEFAULT_INQUILINO_FILTERS)
    return items.map(mapInquilinoDtoToListRow)
  } catch {
    return []
  }
})

export const getInquilinoFormById = cache(
  async (id: string): Promise<ProprietarioFormData | null> => {
    const accessToken = await getAccessToken()
    if (!accessToken) return null

    try {
      const dto = await apiGetPerson(accessToken, id)
      return personDtoToFormData(dto)
    } catch {
      return null
    }
  },
)
