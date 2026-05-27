import { CriarImovelWizard } from '@/app/components/CriarImovelWizard/CriarImovelWizard'
import { getImovelById, getCategories, getSubcategories } from '@/lib/imoveis/data'
import type { ImovelFormData } from '@/lib/imoveis/types'
import type { Imovel } from '@/lib/imoveis/api'
import { redirect } from 'next/navigation'

function mapImovelToFormData(imovel: Imovel): ImovelFormData {
  return {
    address: { ...imovel.address },
    code: imovel.code,
    status: imovel.status,
    rent_price: Number(imovel.rent_price) || 0,
    category_id: imovel.category_id,
    subcategory_id: imovel.subcategory_id,
  }
}

export default async function EditarImovelPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [imovel, categories, subcategories] = await Promise.all([
    getImovelById(id),
    getCategories(),
    getSubcategories(),
  ])

  if (!imovel) {
    redirect('/imoveis')
  }

  const initialData = mapImovelToFormData(imovel)

  return (
    <CriarImovelWizard
      mode="edit"
      initialData={initialData}
      imovelId={imovel.id}
      categories={categories}
      subcategories={subcategories}
    />
  )
}
