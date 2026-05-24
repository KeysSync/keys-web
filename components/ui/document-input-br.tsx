'use client'

import { useEffect, useState } from 'react'
import { maskBrDocumentInput } from '@/lib/format/br'
import { cn } from '@/lib/utils'

export interface DocumentInputBrProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: string
  onChange?: (value: string) => void
}

export function DocumentInputBr({
  value,
  onChange,
  className,
  disabled,
  id,
  placeholder = '000.000.000-00 ou 00.000.000/0000-00',
  ...rest
}: DocumentInputBrProps) {
  const [display, setDisplay] = useState(() => maskBrDocumentInput(value))

  useEffect(() => {
    setDisplay(maskBrDocumentInput(value))
  }, [value])

  function handleChange(raw: string) {
    const masked = maskBrDocumentInput(raw)
    setDisplay(masked)
    onChange?.(masked)
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
