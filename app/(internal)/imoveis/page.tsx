import { getImoveis } from '@/lib/imoveis/data'
import ImoveisListContent from './ImoveisListContent'

export default async function ImoveisPage() {
  const imoveis = await getImoveis()
  return <ImoveisListContent imoveis={imoveis} />
}
