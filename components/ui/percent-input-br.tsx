'use client'

import { useEffect, useState } from 'react'
import {
  formatBrPercent,
  maskBrPercentInput,
  parseBrPercent,
} from '@/lib/format/br'
import { cn } from '@/lib/utils'

export interface PercentInputBrProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: number | ''
  onChange?: (value: number | '') => void
}

export function PercentInputBr({
  value,
  onChange,
  className,
  disabled,
  id,
  placeholder = '0,00%',
  ...rest
}: PercentInputBrProps) {
  const [display, setDisplay] = useState(() => formatBrPercent(value))

  useEffect(() => {
    setDisplay(formatBrPercent(value))
  }, [value])

  function handleChange(raw: string) {
    const masked = maskBrPercentInput(raw)
    setDisplay(masked)
    onChange?.(parseBrPercent(masked))
  }

  function handleBlur() {
    if (!display) return
    const parsed = parseBrPercent(display)
    if (parsed === '') setDisplay(formatBrPercent(value))
  }

  return (
    <input
      {...rest}
      id={id}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      disabled={disabled}
      className={cn('contrato-criar-input', className)}
      placeholder={placeholder}
      value={display}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
    />
  )
}
