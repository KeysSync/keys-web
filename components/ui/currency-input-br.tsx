'use client'

import { useEffect, useState } from 'react'
import {
  formatBrCurrency,
  maskBrCurrencyInput,
  parseBrCurrency,
} from '@/lib/format/br'
import { cn } from '@/lib/utils'

export interface CurrencyInputBrProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: number | ''
  onChange?: (value: number | '') => void
}

export function CurrencyInputBr({
  value,
  onChange,
  className,
  disabled,
  id,
  placeholder = '0,00',
  ...rest
}: CurrencyInputBrProps) {
  const [display, setDisplay] = useState(() => formatBrCurrency(value))

  useEffect(() => {
    setDisplay(formatBrCurrency(value))
  }, [value])

  function handleChange(raw: string) {
    const masked = maskBrCurrencyInput(raw)
    setDisplay(masked)
    onChange?.(parseBrCurrency(masked))
  }

  function handleBlur() {
    if (!display) return
    const parsed = parseBrCurrency(display)
    if (parsed === '') setDisplay(formatBrCurrency(value))
  }

  return (
    <div
      className={cn(
        'masked-input-br masked-input-br--currency',
        disabled && 'masked-input-br--disabled',
        className,
      )}
    >
      <span className="masked-input-br__prefix" aria-hidden>
        R$
      </span>
      <input
        {...rest}
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        disabled={disabled}
        className="masked-input-br__field"
        placeholder={placeholder}
        value={display}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
      />
    </div>
  )
}
