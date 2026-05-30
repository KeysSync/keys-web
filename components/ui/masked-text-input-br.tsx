'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export type MaskedTextKind = 'agency' | 'bankAccount' | 'policy' | 'phone'

export interface MaskedTextInputBrProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: string
  onChange?: (value: string) => void
  mask: MaskedTextKind
}

type MaskFn = (raw: string) => string

const MASKS: Record<MaskedTextKind, MaskFn> = {
  agency: (raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, 5)
    if (!digits) return ''
    if (digits.length <= 4) return digits
    return `${digits.slice(0, 4)}-${digits.slice(4)}`
  },
  bankAccount: (raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, 13)
    if (!digits) return ''
    if (digits.length <= 1) return digits
    return `${digits.slice(0, -1)}-${digits.slice(-1)}`
  },
  policy: (raw) => {
    const clean = raw
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 24)
    if (!clean) return ''
    return clean.replace(/(.{4})(?=.)/g, '$1-').replace(/-$/, '')
  },
  phone: (raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, 11)
    if (!digits) return ''
    if (digits.length <= 2) return digits.length === 2 ? `(${digits}` : digits
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  },
}

const PLACEHOLDERS: Record<MaskedTextKind, string> = {
  agency: '0000-0',
  bankAccount: '00000-0',
  policy: 'XXXX-XXXX-XXXX',
  phone: '(00) 00000-0000',
}

export function MaskedTextInputBr({
  value,
  onChange,
  className,
  disabled,
  id,
  mask,
  placeholder,
  ...rest
}: MaskedTextInputBrProps) {
  const applyMask = MASKS[mask]
  const [display, setDisplay] = useState(() => applyMask(value))

  useEffect(() => {
    setDisplay(applyMask(value))
  }, [value, mask])

  function handleChange(raw: string) {
    const masked = applyMask(raw)
    setDisplay(masked)
    onChange?.(masked)
  }

  return (
    <input
      {...rest}
      id={id}
      type="text"
      inputMode={mask === 'policy' ? 'text' : 'numeric'}
      autoComplete="off"
      disabled={disabled}
      className={cn('contract-create-input', className)}
      placeholder={placeholder ?? PLACEHOLDERS[mask]}
      value={display}
      onChange={(e) => handleChange(e.target.value)}
    />
  )
}
