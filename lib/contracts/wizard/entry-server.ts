import 'server-only'

import { cookies } from 'next/headers'
import { CONTRACT_CREATE_ENTRY_COOKIE } from './entry-cookie'

/** Valida entrada no servidor (App Router). */
export async function hasContractCreateEntryServer(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(CONTRACT_CREATE_ENTRY_COOKIE)?.value === '1'
}
