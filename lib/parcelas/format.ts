export function formatParcelaCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatParcelaDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR')
}

export function monthOfIso(iso: string) {
  return iso.slice(0, 7)
}
