/** Formata número como moeda BRL (sem símbolo R$). */
export function formatBrCurrency(value: number | ''): string {
  if (value === '' || typeof value !== 'number' || Number.isNaN(value)) return ''
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** Máscara de moeda: dígitos viram centavos → 1.234,56 */
export function maskBrCurrencyInput(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  const cents = Number.parseInt(digits, 10)
  if (Number.isNaN(cents)) return ''
  return (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function parseBrCurrency(masked: string): number | '' {
  const digits = masked.replace(/\D/g, '')
  if (!digits) return ''
  const cents = Number.parseInt(digits, 10)
  if (Number.isNaN(cents)) return ''
  return cents / 100
}

export function formatBrPercent(value: number | ''): string {
  if (value === '' || typeof value !== 'number' || Number.isNaN(value)) return ''
  return `${value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`
}

export function maskBrPercentInput(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  const cents = Number.parseInt(digits, 10)
  if (Number.isNaN(cents)) return ''
  return `${(cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`
}

export function parseBrPercent(masked: string): number | '' {
  const digits = masked.replace(/\D/g, '')
  if (!digits) return ''
  const cents = Number.parseInt(digits, 10)
  if (Number.isNaN(cents)) return ''
  return cents / 100
}

export function maskBrIntegerInput(raw: string, maxDigits = 6): string {
  return raw.replace(/\D/g, '').slice(0, maxDigits)
}

export function parseBrInteger(masked: string): number | '' {
  const digits = masked.replace(/\D/g, '')
  if (!digits) return ''
  const n = Number.parseInt(digits, 10)
  return Number.isNaN(n) ? '' : n
}

/** Dia de vencimento (1–31). */
export function maskBrDayInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 2)
  if (!digits) return ''
  const n = Number.parseInt(digits, 10)
  if (Number.isNaN(n)) return digits
  if (n > 31) return '31'
  return digits
}

export function parseBrDay(masked: string): number | '' {
  const digits = masked.replace(/\D/g, '')
  if (!digits) return ''
  const n = Number.parseInt(digits, 10)
  if (Number.isNaN(n) || n < 1) return ''
  return Math.min(n, 31)
}

export function maskBrDocumentInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 14)
  if (!digits) return ''

  if (digits.length <= 11) {
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
    if (digits.length <= 9) {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
    }
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
  }

  if (digits.length <= 2) return digits
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
  }
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
  }
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}

export function maskBrPhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  if (!digits) return ''
  if (digits.length <= 2) return digits.length === 2 ? `(${digits}` : digits
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function maskBrAgencyInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 5)
  if (!digits) return ''
  if (digits.length <= 4) return digits
  return `${digits.slice(0, 4)}-${digits.slice(4)}`
}

export function maskBrBankAccountInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 13)
  if (!digits) return ''
  if (digits.length <= 1) return digits
  return `${digits.slice(0, -1)}-${digits.slice(-1)}`
}

/** Apólice / código alfanumérico em blocos. */
export function maskBrPolicyInput(raw: string): string {
  const clean = raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 24)
  if (!clean) return ''
  return clean.replace(/(.{4})(?=.)/g, '$1-').replace(/-$/, '')
}

/** Chave PIX: documento, telefone ou texto livre (e-mail/aleatória). */
export function maskBrPixKeyInput(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  if (trimmed.includes('@')) return raw
  if (/^[0-9a-f-]{32,}$/i.test(trimmed.replace(/-/g, ''))) {
    return raw.toLowerCase()
  }
  const digits = raw.replace(/\D/g, '')
  if (digits.length >= 11) {
    if (digits.length <= 11) return maskBrDocumentInput(raw)
    if (digits.length <= 14) return maskBrDocumentInput(raw)
    return maskBrPhoneInput(raw)
  }
  if (digits.length >= 3) return maskBrPhoneInput(raw)
  return raw
}
