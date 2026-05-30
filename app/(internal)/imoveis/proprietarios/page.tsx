import { getOwnersList } from '@/lib/owners/data'
import OwnersListContent from './OwnersListContent'

export default async function OwnersPage() {
  const owners = await getOwnersList()

  return <OwnersListContent owners={owners} />
}
