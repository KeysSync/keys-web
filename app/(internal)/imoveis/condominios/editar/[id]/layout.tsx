import '@/app/(internal)/locacao/contratos/criar/style.css'
import '@/app/components/EntityForm/entity-form.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editar condomínio',
  description: 'Editar informações do condomínio',
}

export default function EditarCondominioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="contracts-create-layout">{children}</div>
}
