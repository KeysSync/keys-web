import { CreateTenantWizard } from '@/app/components/CreateTenantWizard/CreateTenantWizard'
import { getTenantFormById } from '@/lib/tenants/data'
import { redirect } from 'next/navigation'

export default async function EditarInquilinoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const initialData = await getTenantFormById(id)
  if (!initialData) {
    redirect('/locacao/inquilinos')
  }

  return (
    <CreateTenantWizard
      mode="edit"
      initialData={initialData}
      inquilinoId={id}
    />
  )
}
