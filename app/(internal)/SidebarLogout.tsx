'use client'

import Link from 'next/link'
import { clearSession } from '@/lib/auth/session'

export default function SidebarLogout() {
  return (
    <Link href="/login" onClick={() => clearSession()}>
      <div className="box box-avatar" />
    </Link>
  )
}
