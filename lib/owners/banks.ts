export type Bank = {
  id: number
  name: string
  code: string
}

/** Lista estática de bancos para selects (referência, não mock de negócio). */
export const BANKS: Bank[] = [
  { id: 1, name: 'Banco do Brasil', code: '001' },
  { id: 2, name: 'Bradesco', code: '237' },
  { id: 3, name: 'Caixa Econômica Federal', code: '104' },
  { id: 4, name: 'Itaú Unibanco', code: '341' },
  { id: 5, name: 'Santander', code: '033' },
  { id: 6, name: 'Nubank', code: '260' },
  { id: 7, name: 'Inter', code: '077' },
  { id: 8, name: 'Sicoob', code: '756' },
  { id: 9, name: 'Sicredi', code: '748' },
  { id: 10, name: 'BTG Pactual', code: '208' },
]

export const bankOptions = BANKS.map((b) => ({
  value: String(b.id),
  label: `${b.code} — ${b.name}`,
}))
