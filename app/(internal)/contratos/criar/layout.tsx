import { hasContratoCriarEntryServer } from '@/lib/contratos/wizard/entry-server'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import './style.css'

export const metadata: Metadata = {
  title: 'Novo contrato',
  description: 'Assistente de cadastro de contrato de locação',
}

export default async function ContratoCriarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!(await hasContratoCriarEntryServer())) {
    redirect('/contratos')
  }

  return <div className="contratos-criar-layout">{children}</div>
}
