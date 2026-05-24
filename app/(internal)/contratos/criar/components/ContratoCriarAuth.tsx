'use client'

import { getSession } from '@/lib/auth/session'
import { useRouter } from 'next/navigation'
import { useLayoutEffect, useState, type ReactNode } from 'react'

/**
 * Sessão mock em sessionStorage — redirect no client.
 * Loading visual: loading.tsx da rota (App Router).
 */
export default function ContratoCriarAuth({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)

  useLayoutEffect(() => {
    if (!getSession()) {
      router.replace('/login')
      return
    }
    setAllowed(true)
  }, [router])

  if (!allowed) return null

  return children
}
