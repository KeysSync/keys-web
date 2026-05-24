'use client'

import { useEffect, useState } from 'react'
import { maskBrIntegerInput, parseBrInteger } from '@/lib/format/br'
import { cn } from '@/lib/utils'

export interface IntegerInputBrProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: number | ''
  onChange?: (value: number | '') => void
  maxDigits?: number
}

export function IntegerInputBr({
  value,
  onChange,
  className,
  disabled,
  id,
  maxDigits = 6,
  placeholder,
  ...rest
}: IntegerInputBrProps) {
  const [display, setDisplay] = useState(() =>
    value === '' ? '' : maskBrIntegerInput(String(value), maxDigits),
  )

  useEffect(() => {
    setDisplay(value === '' ? '' : maskBrIntegerInput(String(value), maxDigits))
  }, [value, maxDigits])

  function handleChange(raw: string) {
    const masked = maskBrIntegerInput(raw, maxDigits)
    setDisplay(masked)
    onChange?.(parseBrInteger(masked))
  }

  return (
    <input
      {...rest}
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      disabled={disabled}
      className={cn('contrato-criar-input', className)}
      placeholder={placeholder}
      value={display}
      onChange={(e) => handleChange(e.target.value)}
    />
  )
}
