import { InstallmentsListContent } from '@/app/components/Installments'
import { getInstallmentsList } from '@/lib/installments/data'

export default async function LancamentosPage() {
  const installments = await getInstallmentsList()
  return <InstallmentsListContent installments={installments} />
}
