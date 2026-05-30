import TenantsListContent from './TenantsListContent'
import { getTenantsList } from '@/lib/tenants/data'

export default async function LocacaoInquilinosPage() {
  const inquilinos = await getTenantsList()

  return <TenantsListContent tenants={inquilinos} />
}
