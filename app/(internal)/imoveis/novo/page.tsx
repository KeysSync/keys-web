import { CriarImovelWizard } from '@/app/components/CriarImovelWizard/CriarImovelWizard'
import { getCategories, getSubcategories } from '@/lib/imoveis/data'

export default async function NovoImovelPage() {
  const [categories, subcategories] = await Promise.all([
    getCategories(),
    getSubcategories(),
  ])

  return (
    <CriarImovelWizard
      categories={categories}
      subcategories={subcategories}
    />
  )
}
