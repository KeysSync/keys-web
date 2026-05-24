'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

export type ContratoSelectOption = {
  value: string
  label: string
}

export interface ContratoSelectProps {
  id?: string
  value: string
  options: ContratoSelectOption[]
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
  'aria-label'?: string
}

type ListPosition = {
  top: number
  left: number
  width: number
  maxHeight: number
}

const LIST_GAP = 6
const LIST_MAX_HEIGHT = 224
const VIEWPORT_PADDING = 8

export function ContratoSelect({
  id,
  value,
  options,
  onChange,
  disabled,
  placeholder = 'Selecione',
  className,
  'aria-label': ariaLabel,
}: ContratoSelectProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState<ListPosition | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const listId = useId()

  const selected = options.find((opt) => opt.value === value)
  const showPlaceholder = !selected && value === ''

  useEffect(() => {
    setMounted(true)
  }, [])

  function updatePosition() {
    const trigger = triggerRef.current
    if (!trigger) return

    const rect = trigger.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_PADDING
    const spaceAbove = rect.top - VIEWPORT_PADDING
    const openUp = spaceBelow < 160 && spaceAbove > spaceBelow

    const maxHeight = Math.min(
      LIST_MAX_HEIGHT,
      openUp ? spaceAbove - LIST_GAP : spaceBelow - LIST_GAP,
    )

    setPosition({
      left: rect.left,
      width: rect.width,
      maxHeight: Math.max(maxHeight, 120),
      top: openUp
        ? rect.top - LIST_GAP - Math.min(LIST_MAX_HEIGHT, maxHeight)
        : rect.bottom + LIST_GAP,
    })
  }

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null)
      return
    }
    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open, options.length])

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (rootRef.current?.contains(target)) return
      if (listRef.current?.contains(target)) return
      setOpen(false)
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function pick(next: string) {
    onChange(next)
    setOpen(false)
  }

  const list =
    open && position && mounted ? (
      <ul
        ref={listRef}
        id={listId}
        className="contrato-criar-custom-select__list contrato-criar-custom-select__list--portal"
        role="listbox"
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          width: position.width,
          maxHeight: position.maxHeight,
        }}
      >
        {options.map((opt) => (
          <li key={opt.value || '__empty'} role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={value === opt.value}
              className={cn(
                'contrato-criar-custom-select__option',
                value === opt.value && 'contrato-criar-custom-select__option--selected',
              )}
              onClick={() => pick(opt.value)}
            >
              {opt.label}
            </button>
          </li>
        ))}
      </ul>
    ) : null

  return (
    <div
      ref={rootRef}
      className={cn(
        'contrato-criar-custom-select',
        open && 'contrato-criar-custom-select--open',
        className,
      )}
    >
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        className="contrato-criar-custom-select__trigger contrato-criar-select"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        onClick={() => {
          if (!disabled) setOpen((prev) => !prev)
        }}
      >
        <span
          className={cn(
            'contrato-criar-custom-select__value',
            showPlaceholder && 'contrato-criar-custom-select__value--placeholder',
          )}
        >
          {selected?.label ?? (value === '' ? placeholder : value)}
        </span>
        <ChevronDown
          size={16}
          className="contrato-criar-custom-select__chevron"
          aria-hidden
        />
      </button>

      {list && createPortal(list, document.body)}
    </div>
  )
}
