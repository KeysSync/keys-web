import { CONTRACT_CREATE_ENTRY_KEY } from './constants'

/** Cookie lido no layout server de /locacao/contratos/criar (fluxo vindo da lista). */
export const CONTRACT_CREATE_ENTRY_COOKIE = CONTRACT_CREATE_ENTRY_KEY

const ENTRY_COOKIE_MAX_AGE_SEC = 60 * 60 * 8

/** Define o cookie de entrada (client). */
export function setContractCreateEntryCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${CONTRACT_CREATE_ENTRY_COOKIE}=1; path=/; max-age=${ENTRY_COOKIE_MAX_AGE_SEC}; SameSite=Lax`
}

/** Remove o cookie de entrada (client). */
export function clearContractCreateEntryCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${CONTRACT_CREATE_ENTRY_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}
