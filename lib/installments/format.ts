export function formatInstallmentCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatInstallmentDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR')
}

export function monthOfIso(iso: string) {
  return iso.slice(0, 7)
}
