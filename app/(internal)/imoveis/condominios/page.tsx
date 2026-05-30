import { CondominiumsListContent } from '@/app/components/CondominiumsListContent/CondominiumsListContent'
import { getCondominiums } from '@/lib/condominiums/data'

export default async function CondominiosPage() {
  const condominiums = await getCondominiums()

  return <CondominiumsListContent condominiums={condominiums} />
}
