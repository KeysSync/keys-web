import { getProprietariosList } from '@/lib/proprietarios/data'
import ProprietariosListContent from './ProprietariosListContent'

export default async function ImoveisProprietariosPage() {
  const proprietarios = await getProprietariosList()

  return <ProprietariosListContent proprietarios={proprietarios} />
}
