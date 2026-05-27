import InquilinosListContent from './InquilinosListContent'
import { getInquilinosList } from '@/lib/inquilinos/data'

export default async function LocacaoInquilinosPage() {
  const inquilinos = await getInquilinosList()

  return <InquilinosListContent inquilinos={inquilinos} />
}
