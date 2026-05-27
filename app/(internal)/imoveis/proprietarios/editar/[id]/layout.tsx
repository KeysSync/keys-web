import '@/app/(internal)/locacao/contratos/criar/style.css'
import '@/app/components/EntityForm/entity-form.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editar proprietário',
  description: 'Editar informações do proprietário',
}

export default function EditarProprietarioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="contratos-criar-layout">{children}</div>
}
