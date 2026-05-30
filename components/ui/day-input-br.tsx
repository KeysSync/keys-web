'use client'

import { useEffect, useState } from 'react'
import { maskBrDayInput, parseBrDay } from '@/lib/format/br'
import { cn } from '@/lib/utils'

export interface DayInputBrProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: number | ''
  onChange?: (value: number | '') => void
}

export function DayInputBr({
  value,
  onChange,
  className,
  disabled,
  id,
  placeholder = '1 a 31',
  ...rest
}: DayInputBrProps) {
  const [display, setDisplay] = useState(() =>
    value === '' ? '' : maskBrDayInput(String(value)),
  )

  useEffect(() => {
    setDisplay(value === '' ? '' : maskBrDayInput(String(value)))
  }, [value])

  function handleChange(raw: string) {
    const masked = maskBrDayInput(raw)
    setDisplay(masked)
    onChange?.(parseBrDay(masked))
  }

  return (
    <input
      {...rest}
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      disabled={disabled}
      className={cn('contract-create-input', className)}
      placeholder={placeholder}
      value={display}
      onChange={(e) => handleChange(e.target.value)}
    />
  )
}
