import { getImoveis, getCategories, getSubcategories } from '@/lib/imoveis/data'
import ImoveisListContent from './ImoveisListContent'

export default async function ImoveisPage() {
  const [imoveis, categories, subcategories] = await Promise.all([
    getImoveis(),
    getCategories(),
    getSubcategories(),
  ])

  return (
    <ImoveisListContent
      imoveis={imoveis}
      categories={categories}
      subcategories={subcategories}
    />
  )
}
