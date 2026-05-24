import 'server-only'

import { cookies } from 'next/headers'
import { CONTRATO_CRIAR_ENTRY_COOKIE } from './entry-cookie'

/** Valida entrada no servidor (App Router). */
export async function hasContratoCriarEntryServer(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(CONTRATO_CRIAR_ENTRY_COOKIE)?.value === '1'
}
