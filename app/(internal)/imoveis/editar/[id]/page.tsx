import { CreatePropertyWizard } from '@/app/components/CreatePropertyWizard/CreatePropertyWizard'
import { getPropertyById, getCategories, getSubcategories } from '@/lib/properties/data'
import type { PropertyFormData } from '@/lib/properties/types'
import type { Property } from '@/lib/properties/api'
import { redirect } from 'next/navigation'

function mapPropertyToFormData(property: Property): PropertyFormData {
  return {
    address: { ...property.address },
    code: property.code,
    status: property.status,
    rent_price: Number(property.rent_price) || 0,
    category_id: property.category_id,
    subcategory_id: property.subcategory_id,
  }
}

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [property, categories, subcategories] = await Promise.all([
    getPropertyById(id),
    getCategories(),
    getSubcategories(),
  ])

  if (!property) {
    redirect('/imoveis')
  }

  const initialData = mapPropertyToFormData(property)

  return (
    <CreatePropertyWizard
      mode="edit"
      initialData={initialData}
      propertyId={property.id}
      categories={categories}
      subcategories={subcategories}
    />
  )
}
