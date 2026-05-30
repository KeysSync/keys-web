import '@/app/(internal)/locacao/contratos/criar/style.css'
import '@/app/components/EntityForm/entity-form.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Novo imóvel',
  description: 'Assistente de cadastro de imóvel',
}

export default function NewPropertyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="contracts-create-layout">{children}</div>
}
