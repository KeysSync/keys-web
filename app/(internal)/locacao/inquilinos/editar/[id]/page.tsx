import { CriarInquilinoWizard } from '@/app/components/CriarInquilinoWizard/CriarInquilinoWizard'
import { getInquilinoFormById } from '@/lib/inquilinos/data'
import { redirect } from 'next/navigation'

export default async function EditarInquilinoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const initialData = await getInquilinoFormById(id)
  if (!initialData) {
    redirect('/locacao/inquilinos')
  }

  return (
    <CriarInquilinoWizard
      mode="edit"
      initialData={initialData}
      inquilinoId={id}
    />
  )
}
