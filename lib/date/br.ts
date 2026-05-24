/** Converte ISO (yyyy-mm-dd) para exibição dd/mm/aaaa */
export function isoDateToBr(iso: string): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return ''
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

/** Converte dd/mm/aaaa para ISO; retorna '' se incompleto ou inválido */
export function brDateToIso(br: string): string {
  const digits = br.replace(/\D/g, '')
  if (digits.length !== 8) return ''

  const day = digits.slice(0, 2)
  const month = digits.slice(2, 4)
  const year = digits.slice(4, 8)
  const iso = `${year}-${month}-${day}`
  const date = new Date(`${iso}T12:00:00`)

  if (Number.isNaN(date.getTime())) return ''
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() + 1 !== Number(month) ||
    date.getDate() !== Number(day)
  ) {
    return ''
  }

  return iso
}

/** Máscara progressiva dd/mm/aaaa enquanto o usuário digita */
export function maskBrDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

/** Converte ISO de mês (yyyy-mm) para mm/aaaa */
export function isoMonthToBr(iso: string): string {
  if (!iso || !/^\d{4}-\d{2}$/.test(iso)) return ''
  const [year, month] = iso.split('-')
  return `${month}/${year}`
}

/** Converte mm/aaaa para ISO (yyyy-mm) */
export function brMonthToIso(br: string): string {
  const digits = br.replace(/\D/g, '')
  if (digits.length !== 6) return ''

  const month = digits.slice(0, 2)
  const year = digits.slice(2, 6)
  const monthNum = Number(month)

  if (monthNum < 1 || monthNum > 12) return ''

  return `${year}-${month}`
}

/** Máscara progressiva mm/aaaa */
export function maskBrMonthInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 6)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}
