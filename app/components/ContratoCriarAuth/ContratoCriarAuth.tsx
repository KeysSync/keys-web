'use client'

import { useState, type ReactNode } from 'react'

/**
 * Sessão mock em sessionStorage — redirect no client.
 * Loading visual: loading.tsx da rota (App Router).
 */
export default function ContratoCriarAuth({ children }: { children: ReactNode }) {
  const [allowed, setAllowed] = useState(false)


  if (!allowed) return null

  return children
}
