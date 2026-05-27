import { CondominiosListContent } from '@/app/components/CondominiosListContent/CondominiosListContent'
import { getCondominiums } from '@/lib/condominiums/data'

export default async function CondominiosPage() {
  const condominiums = await getCondominiums()

  return <CondominiosListContent condominiums={condominiums} />
}
