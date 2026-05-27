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
import type { InquilinoUserFilters } from '@/lib/inquilinos/api'
import { useCallback, useState } from 'react'
import './inquilinos-filter.css'

function emptyFilters(): InquilinoUserFilters {
  return {}
}

interface InquilinosFilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentFilters: InquilinoUserFilters
  onApply: (filters: InquilinoUserFilters) => void
}

export function InquilinosFilterDialog({
  open,
  onOpenChange,
  currentFilters,
  onApply,
}: InquilinosFilterDialogProps) {
  const [draft, setDraft] = useState<InquilinoUserFilters>(() => ({
    ...currentFilters,
  }))

  const resetDraft = useCallback(() => {
    setDraft({ ...currentFilters })
  }, [currentFilters])

  function patch(partial: Partial<InquilinoUserFilters>) {
    setDraft((prev) => ({ ...prev, ...partial }))
  }

  function handleClear() {
    setDraft(emptyFilters())
  }

  function handleApply() {
    const cleaned: InquilinoUserFilters = {}
    if (draft.city?.trim()) cleaned.city = draft.city.trim()
    if (draft.state?.trim()) cleaned.state = draft.state.trim().toUpperCase()
    if (draft.document?.trim()) cleaned.document = draft.document.trim()
    if (draft.q?.trim()) cleaned.q = draft.q.trim()
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
            Filtre inquilinos por cidade/estado, documento e texto livre.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="inquilinos-filter-grid">
            <div className="inquilinos-filter-field">
              <label
                className="inquilinos-filter-label"
                htmlFor="filter-city"
              >
                Cidade
              </label>
              <input
                id="filter-city"
                type="text"
                className="inquilinos-filter-input"
                value={draft.city ?? ''}
                onChange={(e) => patch({ city: e.target.value })}
                placeholder="Ex.: São Paulo"
              />
            </div>

            <div className="inquilinos-filter-field">
              <label
                className="inquilinos-filter-label"
                htmlFor="filter-state"
              >
                Estado
              </label>
              <input
                id="filter-state"
                type="text"
                maxLength={2}
                className="inquilinos-filter-input"
                value={draft.state ?? ''}
                onChange={(e) =>
                  patch({ state: e.target.value.toUpperCase() })
                }
                placeholder="Ex.: SP"
              />
            </div>

            <div className="inquilinos-filter-field">
              <label
                className="inquilinos-filter-label"
                htmlFor="filter-document"
              >
                Documento
              </label>
              <input
                id="filter-document"
                type="text"
                className="inquilinos-filter-input"
                value={draft.document ?? ''}
                onChange={(e) => patch({ document: e.target.value })}
                placeholder="CPF ou CNPJ"
              />
            </div>

            <div className="inquilinos-filter-field">
              <label className="inquilinos-filter-label" htmlFor="filter-q">
                Texto (q)
              </label>
              <input
                id="filter-q"
                type="text"
                className="inquilinos-filter-input"
                value={draft.q ?? ''}
                onChange={(e) => patch({ q: e.target.value })}
                placeholder="Ex.: nome ou e-mail"
              />
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="inquilinos-filter-actions">
            <button
              type="button"
              className="inquilinos-filter-btn-clear"
              onClick={handleClear}
            >
              Limpar filtros
            </button>
            <button
              type="button"
              className="inquilinos-filter-btn-apply"
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

