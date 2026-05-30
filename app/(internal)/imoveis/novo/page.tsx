import { CreatePropertyWizard } from '@/app/components/CreatePropertyWizard/CreatePropertyWizard'
import { getCategories, getSubcategories } from '@/lib/properties/data'

export default async function NewPropertyPage() {
  const [categories, subcategories] = await Promise.all([
    getCategories(),
    getSubcategories(),
  ])

  return (
    <CreatePropertyWizard
      categories={categories}
      subcategories={subcategories}
    />
  )
}
