import 'server-only'

import { cache } from 'react'
import { getAccessToken } from '@/lib/auth/cookies'
import {
  apiGetPerson,
  apiListTenants,
  mapTenantDtoToListRow,
  personDtoToFormData,
  type TenantListFilters,
  type TenantListRow,
} from '@/lib/tenants/api'
import type { OwnerFormData } from '@/lib/owners/types'

const DEFAULT_INQUILINO_FILTERS: TenantListFilters = {
  type: 'person',
  is_renter: true,
}

export const getTenantsList = cache(async (): Promise<TenantListRow[]> => {
  const accessToken = await getAccessToken()
  if (!accessToken) return []

  try {
    const items = await apiListTenants(accessToken, DEFAULT_INQUILINO_FILTERS)
    return items.map(mapTenantDtoToListRow)
  } catch {
    return []
  }
})

export const getTenantFormById = cache(
  async (id: string): Promise<OwnerFormData | null> => {
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
