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
import type { TenantUserFilters } from '@/lib/tenants/api'
import { useCallback, useState } from 'react'
import './tenants-filter.css'

function emptyFilters(): TenantUserFilters {
  return {}
}

interface TenantsFilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentFilters: TenantUserFilters
  onApply: (filters: TenantUserFilters) => void
}

export function TenantsFilterDialog({
  open,
  onOpenChange,
  currentFilters,
  onApply,
}: TenantsFilterDialogProps) {
  const [draft, setDraft] = useState<TenantUserFilters>(() => ({
    ...currentFilters,
  }))

  const resetDraft = useCallback(() => {
    setDraft({ ...currentFilters })
  }, [currentFilters])

  function patch(partial: Partial<TenantUserFilters>) {
    setDraft((prev) => ({ ...prev, ...partial }))
  }

  function handleClear() {
    setDraft(emptyFilters())
  }

  function handleApply() {
    const cleaned: TenantUserFilters = {}
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
          <div className="tenants-filter-grid">
            <div className="tenants-filter-field">
              <label
                className="tenants-filter-label"
                htmlFor="filter-city"
              >
                Cidade
              </label>
              <input
                id="filter-city"
                type="text"
                className="tenants-filter-input"
                value={draft.city ?? ''}
                onChange={(e) => patch({ city: e.target.value })}
                placeholder="Ex.: São Paulo"
              />
            </div>

            <div className="tenants-filter-field">
              <label
                className="tenants-filter-label"
                htmlFor="filter-state"
              >
                Estado
              </label>
              <input
                id="filter-state"
                type="text"
                maxLength={2}
                className="tenants-filter-input"
                value={draft.state ?? ''}
                onChange={(e) =>
                  patch({ state: e.target.value.toUpperCase() })
                }
                placeholder="Ex.: SP"
              />
            </div>

            <div className="tenants-filter-field">
              <label
                className="tenants-filter-label"
                htmlFor="filter-document"
              >
                Documento
              </label>
              <input
                id="filter-document"
                type="text"
                className="tenants-filter-input"
                value={draft.document ?? ''}
                onChange={(e) => patch({ document: e.target.value })}
                placeholder="CPF ou CNPJ"
              />
            </div>

            <div className="tenants-filter-field">
              <label className="tenants-filter-label" htmlFor="filter-q">
                Texto (q)
              </label>
              <input
                id="filter-q"
                type="text"
                className="tenants-filter-input"
                value={draft.q ?? ''}
                onChange={(e) => patch({ q: e.target.value })}
                placeholder="Ex.: nome ou e-mail"
              />
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="tenants-filter-actions">
            <button
              type="button"
              className="tenants-filter-btn-clear"
              onClick={handleClear}
            >
              Limpar filtros
            </button>
            <button
              type="button"
              className="tenants-filter-btn-apply"
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

