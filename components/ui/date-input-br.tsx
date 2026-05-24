'use client'

import { useEffect, useRef, useState } from 'react'
import { Calendar } from 'lucide-react'
import { brDateToIso, isoDateToBr, maskBrDateInput } from '@/lib/date/br'
import { cn } from '@/lib/utils'

export interface DateInputBrProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: string
  onChange?: (isoValue: string) => void
}

export function DateInputBr({
  value,
  onChange,
  className,
  disabled,
  id,
  placeholder = 'dd/mm/aaaa',
  ...rest
}: DateInputBrProps) {
  const pickerRef = useRef<HTMLInputElement>(null)
  const [display, setDisplay] = useState(() => isoDateToBr(value))

  useEffect(() => {
    setDisplay(isoDateToBr(value))
  }, [value])

  function commitIso(iso: string) {
    setDisplay(isoDateToBr(iso))
    onChange?.(iso)
  }

  function handleTextChange(raw: string) {
    const masked = maskBrDateInput(raw)
    setDisplay(masked)
    onChange?.(brDateToIso(masked))
  }

  function handleBlur() {
    if (!display) return
    const iso = brDateToIso(display)
    if (!iso) setDisplay(isoDateToBr(value))
  }

  function handlePickerChange(iso: string) {
    if (!iso) return
    commitIso(iso)
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
        aria-label={rest['aria-label'] ?? 'Data no formato dia, mês e ano'}
      />

      <button
        type="button"
        className="date-input-br__trigger"
        disabled={disabled}
        onClick={openPicker}
        aria-label="Abrir calendário"
        tabIndex={disabled ? -1 : 0}
      >
        <Calendar size={16} aria-hidden />
      </button>

      <input
        ref={pickerRef}
        type="date"
        className="date-input-br__picker"
        value={value || ''}
        tabIndex={-1}
        aria-hidden
        onChange={(e) => handlePickerChange(e.target.value)}
      />
    </div>
  )
}
