import '@/app/(internal)/locacao/contratos/criar/style.css'
import '@/app/components/EntityForm/entity-form.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editar imóvel',
  description: 'Editar informações do imóvel',
}

export default function EditPropertyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="contracts-create-layout">{children}</div>
}
