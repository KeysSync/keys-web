import { CriarCondominioWizard } from '@/app/components/CriarCondominioWizard/CriarCondominioWizard'
import { getCondominiumById } from '@/lib/condominiums/data'
import type { Condominium } from '@/lib/condominiums/api'
import type { CondominiumFormData } from '@/lib/condominiums/types'
import { redirect } from 'next/navigation'

function mapCondominiumToFormData(c: Condominium): CondominiumFormData {
  return {
    code: c.code,
    name: c.name,
    obs: c.obs ?? '',
    address: {
      postal_code: c.address?.postal_code ?? '',
      street: c.address?.street ?? '',
      number: c.address?.number ?? '',
      complement: c.address?.complement ?? '',
      neighborhood: c.address?.neighborhood ?? '',
      city: c.address?.city ?? '',
      state: c.address?.state ?? '',
    },
  }
}

export default async function EditarCondominioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const condominium = await getCondominiumById(id)

  if (!condominium) {
    redirect('/imoveis/condominios')
  }

  const initialData = mapCondominiumToFormData(condominium)

  return (
    <CriarCondominioWizard
      mode="edit"
      initialData={initialData}
      condominiumId={condominium.id}
    />
  )
}
