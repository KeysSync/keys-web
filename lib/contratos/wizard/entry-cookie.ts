import { CONTRATO_CRIAR_ENTRY_KEY } from './constants'

/** Cookie lido no layout server de /locacao/contratos/criar (fluxo vindo da lista). */
export const CONTRATO_CRIAR_ENTRY_COOKIE = CONTRATO_CRIAR_ENTRY_KEY

const ENTRY_COOKIE_MAX_AGE_SEC = 60 * 60 * 8

/** Define o cookie de entrada (client). */
export function setContratoCriarEntryCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${CONTRATO_CRIAR_ENTRY_COOKIE}=1; path=/; max-age=${ENTRY_COOKIE_MAX_AGE_SEC}; SameSite=Lax`
}

/** Remove o cookie de entrada (client). */
export function clearContratoCriarEntryCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${CONTRATO_CRIAR_ENTRY_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}
