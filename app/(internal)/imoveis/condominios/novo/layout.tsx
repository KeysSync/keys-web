import '@/app/(internal)/locacao/contratos/criar/style.css'
import '@/app/components/EntityForm/entity-form.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Novo condomínio',
  description: 'Assistente de cadastro de condomínio',
}

export default function NovoCondominioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="contratos-criar-layout">{children}</div>
}
