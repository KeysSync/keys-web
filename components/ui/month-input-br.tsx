'use client'

import { useEffect, useRef, useState } from 'react'
import { Calendar } from 'lucide-react'
import { brMonthToIso, isoMonthToBr, maskBrMonthInput } from '@/lib/date/br'
import { cn } from '@/lib/utils'

export interface MonthInputBrProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: string
  onChange: (isoMonth: string) => void
}

export function MonthInputBr({
  value,
  onChange,
  className,
  disabled,
  id,
  placeholder = 'mm/aaaa',
  ...rest
}: MonthInputBrProps) {
  const pickerRef = useRef<HTMLInputElement>(null)
  const [display, setDisplay] = useState(() => isoMonthToBr(value))

  useEffect(() => {
    setDisplay(isoMonthToBr(value))
  }, [value])

  function commitIso(isoMonth: string) {
    setDisplay(isoMonthToBr(isoMonth))
    onChange(isoMonth)
  }

  function handleTextChange(raw: string) {
    const masked = maskBrMonthInput(raw)
    setDisplay(masked)
    onChange(brMonthToIso(masked))
  }

  function handleBlur() {
    if (!display) return
    const iso = brMonthToIso(display)
    if (!iso) setDisplay(isoMonthToBr(value))
  }

  function handlePickerChange(isoMonth: string) {
    if (!isoMonth) return
    commitIso(isoMonth)
  }

  function openPicker() {
    if (disabled) return
    const picker = pickerRef.current
    if (!picker) return

    try {
      picker.showPicker()
    } catch {
      picker.focus()
      picker.click()
    }
  }

  return (
    <div
      className={cn(
        'date-input-br',
        disabled && 'date-input-br--disabled',
        className,
      )}
    >
      <input
        {...rest}
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        disabled={disabled}
        className="date-input-br__field"
        placeholder={placeholder}
        value={display}
        onChange={(e) => handleTextChange(e.target.value)}
        onBlur={handleBlur}
        aria-label={rest['aria-label'] ?? 'Mês e ano no formato mm/aaaa'}
      />

      <button
        type="button"
        className="date-input-br__trigger"
        disabled={disabled}
        onClick={openPicker}
        aria-label="Abrir seletor de mês"
        tabIndex={disabled ? -1 : 0}
      >
        <Calendar size={16} aria-hidden />
      </button>

      <input
        ref={pickerRef}
        type="month"
        className="date-input-br__picker"
        value={value || ''}
        tabIndex={-1}
        aria-hidden
        onChange={(e) => handlePickerChange(e.target.value)}
      />
    </div>
  )
}
