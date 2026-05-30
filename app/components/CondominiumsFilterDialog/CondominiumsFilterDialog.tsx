'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog'
import type { CondominiumFilters } from '@/lib/condominiums/api'
import { useCallback, useState } from 'react'
import './condominiums-filter.css'

function emptyFilters(): CondominiumFilters {
  return {}
}

interface CondominiosFilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentFilters: CondominiumFilters
  onApply: (filters: CondominiumFilters) => void
}

export function CondominiumsFilterDialog({
  open,
  onOpenChange,
  currentFilters,
  onApply,
}: CondominiosFilterDialogProps) {
  const [draft, setDraft] = useState<CondominiumFilters>(() => ({
    ...currentFilters,
  }))

  const resetDraft = useCallback(() => {
    setDraft({ ...currentFilters })
  }, [currentFilters])

  function patch(partial: Partial<CondominiumFilters>) {
    setDraft((prev) => ({ ...prev, ...partial }))
  }

  function handleClear() {
    setDraft(emptyFilters())
  }

  function handleApply() {
    const cleaned: CondominiumFilters = {}
    if (draft.city?.trim()) cleaned.city = draft.city.trim()
    if (draft.state?.trim()) cleaned.state = draft.state.trim()
    onApply(cleaned)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) resetDraft()
        onOpenChange(next)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
          <DialogDescription>
            Filtre condomínios por cidade e estado.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="condominiums-filter-grid">
            <div className="condominiums-filter-field">
              <label className="condominiums-filter-label" htmlFor="filter-city">
                Cidade
              </label>
              <input
                id="filter-city"
                type="text"
                className="condominiums-filter-input"
                value={draft.city ?? ''}
                onChange={(e) => patch({ city: e.target.value })}
                placeholder="Ex.: São Paulo"
              />
            </div>

            <div className="condominiums-filter-field">
              <label className="condominiums-filter-label" htmlFor="filter-state">
                Estado
              </label>
              <input
                id="filter-state"
                type="text"
                maxLength={2}
                className="condominiums-filter-input"
                value={draft.state ?? ''}
                onChange={(e) => patch({ state: e.target.value.toUpperCase() })}
                placeholder="Ex.: SP"
              />
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="condominiums-filter-actions">
            <button
              type="button"
              className="condominiums-filter-btn-clear"
              onClick={handleClear}
            >
              Limpar filtros
            </button>
            <button
              type="button"
              className="condominiums-filter-btn-apply"
              onClick={handleApply}
            >
              Aplicar
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
