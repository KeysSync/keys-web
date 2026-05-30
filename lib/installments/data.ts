import 'server-only'

import { cache } from 'react'
import type { Entry } from './entry-types'

/** Lançamentos/parcelas — retorna vazio até a API estar disponível. */
export const getInstallmentsList = cache(async (): Promise<Entry[]> => {
  return []
})

export const getInstallmentsByContractId = cache(
  async (_contractId: string): Promise<Entry[]> => {
    return []
  },
)
