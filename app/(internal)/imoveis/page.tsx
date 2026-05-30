import { getProperties, getCategories, getSubcategories } from '@/lib/properties/data'
import PropertiesListContent from './PropertiesListContent'

export default async function PropertiesPage() {
  const [properties, categories, subcategories] = await Promise.all([
    getProperties(),
    getCategories(),
    getSubcategories(),
  ])

  return (
    <PropertiesListContent
      properties={properties}
      categories={categories}
      subcategories={subcategories}
    />
  )
}
