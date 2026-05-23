'use client'

import { getSession } from '@/lib/auth/session'
import { hasContratoCriarEntry } from '@/lib/contratos/wizard/draft'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'

export default function CriarContratoShell({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!getSession()) {
      router.replace('/login')
      return
    }

    if (!hasContratoCriarEntry()) {
      router.replace('/contratos')
      return
    }

    setReady(true)
  }, [router])

  if (!ready) {
    return (
      <div className="contrato-criar-loading">
        <p>Carregando…</p>
      </div>
    )
  }

  return <>{children}</>
}
