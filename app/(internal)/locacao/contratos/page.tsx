import { ContractsListContent } from './ContractsListContent'
import { getContractsList } from '@/lib/contracts/data'

export default async function LocacaoContratosPage() {
  const contracts = await getContractsList()
  return <ContractsListContent contracts={contracts} />
}
