import { CriarProprietarioWizard } from '@/app/components/CriarProprietarioWizard/CriarProprietarioWizard'
import { getProprietarioFormById } from '@/lib/proprietarios/data'
import { redirect } from 'next/navigation'

export default async function EditarProprietarioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const initialData = await getProprietarioFormById(id)
  if (!initialData) {
    redirect('/imoveis/proprietarios')
  }

  return (
    <CriarProprietarioWizard
      mode="edit"
      initialData={initialData}
      proprietarioId={id}
    />
  )
}
