import 'server-only'

import { cache } from 'react'
import type { Contract } from './types'

/** Lista de contratos — retorna vazio até a API estar disponível. */
export const getContractsList = cache(async (): Promise<Contract[]> => {
  return []
})

export const getContractById = cache(
  async (_id: string): Promise<Contract | null> => {
    return null
  },
)
