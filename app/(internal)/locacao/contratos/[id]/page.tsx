import { ContractInstallmentsContent } from '@/app/components/ContractInstallments'
import { getContractById } from '@/lib/contracts/data'
import { getInstallmentsByContractId } from '@/lib/installments/data'
import { notFound } from 'next/navigation'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function ContratoDetailPage({ params }: PageProps) {
  const { id } = await params
  const contract = await getContractById(id)
  if (!contract) notFound()

  const installments = await getInstallmentsByContractId(id)

  return (
    <ContractInstallmentsContent contract={contract} installments={installments} />
  )
}
