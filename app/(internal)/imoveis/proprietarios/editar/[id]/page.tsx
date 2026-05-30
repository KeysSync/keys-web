import { CreateOwnerWizard } from '@/app/components/CreateOwnerWizard/CreateOwnerWizard'
import { getOwnerFormById } from '@/lib/owners/data'
import { redirect } from 'next/navigation'

export default async function EditOwnerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const initialData = await getOwnerFormById(id)
  if (!initialData) {
    redirect('/imoveis/proprietarios')
  }

  return (
    <CreateOwnerWizard
      mode="edit"
      initialData={initialData}
      ownerId={id}
    />
  )
}
