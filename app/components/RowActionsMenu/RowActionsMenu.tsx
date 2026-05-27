'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MoreVertical } from 'lucide-react'

export interface RowAction {
  label: string
  icon?: React.ReactNode
  variant?: 'default' | 'danger'
  onClick: () => void
}

interface RowActionsMenuProps {
  actions: RowAction[]
}

interface MenuPosition {
  top: number
  left: number
  openUp: boolean
}

export function RowActionsMenu({ actions }: RowActionsMenuProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const [pos, setPos] = useState<MenuPosition | null>(null)

  const computePosition = useCallback(() => {
    const btn = triggerRef.current
    if (!btn) return null
    const rect = btn.getBoundingClientRect()
    const menuHeight = 90
    const gap = 4
    const spaceBelow = window.innerHeight - rect.bottom
    const openUp = spaceBelow < menuHeight + gap

    return {
      top: openUp ? rect.top - gap : rect.bottom + gap,
      left: rect.right,
      openUp,
    }
  }, [])

  useEffect(() => {
    if (!open) {
      setPos(null)
      return
    }
    setPos(computePosition())

    function handleClose(e: MouseEvent) {
      if (
        menuRef.current?.contains(e.target as Node) ||
        triggerRef.current?.contains(e.target as Node)
      )
        return
      setOpen(false)
    }

    function handleScroll() {
      setOpen(false)
    }

    document.addEventListener('mousedown', handleClose)
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      document.removeEventListener('mousedown', handleClose)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [open, computePosition])

  return (
    <div className="row-actions">
      <button
        ref={triggerRef}
        type="button"
        className="row-actions__trigger"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((prev) => !prev)
        }}
        aria-label="Ações"
      >
        <MoreVertical size={16} />
      </button>

      {open && pos
        ? createPortal(
            <ul
              ref={menuRef}
              className="row-actions__menu"
              role="menu"
              style={{
                position: 'fixed',
                top: pos.openUp ? undefined : pos.top,
                bottom: pos.openUp
                  ? window.innerHeight - pos.top
                  : undefined,
                left: pos.left,
                transform: 'translateX(-100%)',
              }}
            >
              {actions.map((action) => (
                <li key={action.label} role="presentation">
                  <button
                    type="button"
                    role="menuitem"
                    className={`row-actions__item${
                      action.variant === 'danger'
                        ? ' row-actions__item--danger'
                        : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpen(false)
                      action.onClick()
                    }}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                </li>
              ))}
            </ul>,
            document.body,
          )
        : null}
    </div>
  )
}
