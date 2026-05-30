import { CreateContractWizard } from '@/app/components/CreateContractWizard/CreateContractWizard'
import { mapApiPropertyToContractSummary } from '@/lib/contracts/property-summary'
import { getProperties } from '@/lib/properties/data'
import { getTenantsList } from '@/lib/tenants/data'

export default async function ContratoCriarPage() {
  const [apiProperties, tenants] = await Promise.all([
    getProperties(),
    getTenantsList(),
  ])

  const properties = apiProperties.map(mapApiPropertyToContractSummary)

  return <CreateContractWizard properties={properties} tenants={tenants} />
}
