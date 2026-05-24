'use client'

import { useEffect, useState } from 'react'
import { maskBrPixKeyInput } from '@/lib/format/br'
import { cn } from '@/lib/utils'

export interface PixKeyInputBrProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: string
  onChange?: (value: string) => void
}

export function PixKeyInputBr({
  value,
  onChange,
  className,
  disabled,
  id,
  placeholder = 'CPF, CNPJ, e-mail, telefone ou chave aleatória',
  ...rest
}: PixKeyInputBrProps) {
  const [display, setDisplay] = useState(() => maskBrPixKeyInput(value))

  useEffect(() => {
    setDisplay(maskBrPixKeyInput(value))
  }, [value])

  function handleChange(raw: string) {
    const masked = maskBrPixKeyInput(raw)
    setDisplay(masked)
    onChange?.(masked)
  }

  return (
    <input
      {...rest}
      id={id}
      type="text"
      autoComplete="off"
      disabled={disabled}
      className={cn('contrato-criar-input', className)}
      placeholder={placeholder}
      value={display}
      onChange={(e) => handleChange(e.target.value)}
    />
  )
}
