export type EntryType =
  | 'rent'
  | 'condo'
  | 'iptu'
  | 'water'
  | 'power'
  | 'gas'
  | 'admin_fee'
  | 'other'

export type EntryResponsibleParty = 'tenant' | 'owner' | 'agency'

export interface ContractEntryItem {
  id: string
  type: EntryType
  description: string
  amount: number | ''
  responsibleParty: EntryResponsibleParty
  recurring: boolean
}

export interface ContractEntriesData {
  items: ContractEntryItem[]
}

export const defaultContractEntriesData = (): ContractEntriesData => ({
  items: [],
})

export const ENTRY_TYPE_OPTIONS: { value: EntryType; label: string }[] = [
  { value: 'rent', label: 'Aluguel' },
  { value: 'condo', label: 'Condomínio' },
  { value: 'iptu', label: 'IPTU' },
  { value: 'water', label: 'Água' },
  { value: 'power', label: 'Energia' },
  { value: 'gas', label: 'Gás' },
  { value: 'admin_fee', label: 'Taxa de administração' },
  { value: 'other', label: 'Outro' },
]

export const ENTRY_RESPONSIBLE_OPTIONS: {
  value: EntryResponsibleParty
  label: string
}[] = [
  { value: 'tenant', label: 'Locatário' },
  { value: 'owner', label: 'Proprietário' },
  { value: 'agency', label: 'Imobiliária' },
]

export function createEntryItem(
  partial?: Partial<ContractEntryItem>,
): ContractEntryItem {
  return {
    id: `lc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: 'other',
    description: '',
    amount: '',
    responsibleParty: 'tenant',
    recurring: true,
    ...partial,
  }
}
