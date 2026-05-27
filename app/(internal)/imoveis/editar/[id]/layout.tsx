import '@/app/(internal)/locacao/contratos/criar/style.css'
import '@/app/components/EntityForm/entity-form.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editar imóvel',
  description: 'Editar informações do imóvel',
}

export default function EditarImovelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="contratos-criar-layout">{children}</div>
}
