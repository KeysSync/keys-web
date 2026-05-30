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
import { SelectField } from '@/components/ui/select'
import type { Category, Subcategory, PropertyFilters } from '@/lib/properties/api'
import { useCallback, useMemo, useState } from 'react'
import './properties-filter.css'

const PRICE_MIN = 0
const PRICE_MAX = 50000
const PRICE_STEP = 100

const STATUS_OPTIONS = [
  { value: 'available', label: 'Disponível' },
  { value: 'rented', label: 'Alugado' },
  { value: 'repairing', label: 'Manutenção' },
]

function emptyFilters(): PropertyFilters {
  return {}
}

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

interface PropertiesFilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  subcategories: Subcategory[]
  currentFilters: PropertyFilters
  onApply: (filters: PropertyFilters) => void
}

export function PropertiesFilterDialog({
  open,
  onOpenChange,
  categories,
  subcategories,
  currentFilters,
  onApply,
}: PropertiesFilterDialogProps) {
  const [draft, setDraft] = useState<PropertyFilters>(() => ({ ...currentFilters }))

  const resetDraft = useCallback(() => {
    setDraft({ ...currentFilters })
  }, [currentFilters])

  function patch(partial: Partial<PropertyFilters>) {
    setDraft((prev) => ({ ...prev, ...partial }))
  }

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: String(c.id), label: c.name })),
    [categories],
  )

  const subcategoryOptions = useMemo(() => {
    if (!draft.category_id) return []
    return subcategories
      .filter((s) => s.category_id === draft.category_id)
      .map((s) => ({ value: String(s.id), label: s.name }))
  }, [draft.category_id, subcategories])

  function handleCategoryChange(id: number) {
    patch({ category_id: id || undefined, subcategory_id: undefined })
  }

  function handleClear() {
    setDraft(emptyFilters())
  }

  function handleApply() {
    const cleaned: PropertyFilters = {}
    if (draft.status) cleaned.status = draft.status
    if (draft.category_id) cleaned.category_id = draft.category_id
    if (draft.subcategory_id) cleaned.subcategory_id = draft.subcategory_id
    if (draft.city?.trim()) cleaned.city = draft.city.trim()
    if (draft.state?.trim()) cleaned.state = draft.state.trim()
    if (draft.code?.trim()) cleaned.code = draft.code.trim()
    if (draft.rent_price_min && draft.rent_price_min > PRICE_MIN) cleaned.rent_price_min = draft.rent_price_min
    if (draft.rent_price_max && draft.rent_price_max < PRICE_MAX) cleaned.rent_price_max = draft.rent_price_max
    onApply(cleaned)
    onOpenChange(false)
  }

  const priceMin = draft.rent_price_min ?? PRICE_MIN
  const priceMax = draft.rent_price_max ?? PRICE_MAX
  const fillLeft = ((priceMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100
  const fillRight = ((priceMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100

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
          <DialogDescription>Filtre os imóveis por critérios específicos.</DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="properties-filter-grid">
            <SelectField
              label="Status"
              value={draft.status ?? ''}
              onChange={(e) => patch({ status: (e.target.value || undefined) as PropertyFilters['status'] })}
              options={STATUS_OPTIONS}
              placeholder="Todos"
              fieldClassName="properties-filter-field"
              labelClassName="properties-filter-label"
            />

            <div className="properties-filter-field">
              <label className="properties-filter-label" htmlFor="filter-code">Código</label>
              <input
                id="filter-code"
                type="text"
                className="properties-filter-input"
                value={draft.code ?? ''}
                onChange={(e) => patch({ code: e.target.value })}
                placeholder="Ex.: IMB-001"
              />
            </div>

            <SelectField
              label="Categoria"
              value={draft.category_id ? String(draft.category_id) : ''}
              onChange={(e) => handleCategoryChange(Number(e.target.value) || 0)}
              options={categoryOptions}
              placeholder="Todas"
              fieldClassName="properties-filter-field"
              labelClassName="properties-filter-label"
            />

            <SelectField
              label="Subcategoria"
              value={draft.subcategory_id ? String(draft.subcategory_id) : ''}
              onChange={(e) => patch({ subcategory_id: Number(e.target.value) || undefined })}
              options={subcategoryOptions}
              placeholder={draft.category_id ? 'Todas' : 'Selecione a categoria'}
              disabled={!draft.category_id}
              fieldClassName="properties-filter-field"
              labelClassName="properties-filter-label"
            />

            <div className="properties-filter-field">
              <label className="properties-filter-label" htmlFor="filter-city">Cidade</label>
              <input
                id="filter-city"
                type="text"
                className="properties-filter-input"
                value={draft.city ?? ''}
                onChange={(e) => patch({ city: e.target.value })}
                placeholder="Ex.: São Paulo"
              />
            </div>

            <div className="properties-filter-field">
              <label className="properties-filter-label" htmlFor="filter-state">Estado</label>
              <input
                id="filter-state"
                type="text"
                maxLength={2}
                className="properties-filter-input"
                value={draft.state ?? ''}
                onChange={(e) => patch({ state: e.target.value.toUpperCase() })}
                placeholder="Ex.: SP"
              />
            </div>
          </div>

          <div className="properties-filter-range">
            <div className="properties-filter-range-header">
              <span className="properties-filter-label">Valor do aluguel</span>
              <span className="properties-filter-range-values">
                {formatBRL(priceMin)} — {priceMax >= PRICE_MAX ? `${formatBRL(PRICE_MAX)}+` : formatBRL(priceMax)}
              </span>
            </div>

            <div className="properties-filter-slider-track">
              <div
                className="properties-filter-slider-fill"
                style={{ left: `${fillLeft}%`, width: `${fillRight - fillLeft}%` }}
              />
            </div>

            <div className="properties-filter-slider-inputs">
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={PRICE_STEP}
                value={priceMin}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  patch({ rent_price_min: Math.min(v, priceMax - PRICE_STEP) })
                }}
                aria-label="Preço mínimo"
              />
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={PRICE_STEP}
                value={priceMax}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  patch({ rent_price_max: Math.max(v, priceMin + PRICE_STEP) })
                }}
                aria-label="Preço máximo"
              />
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="properties-filter-actions">
            <button type="button" className="properties-filter-btn-clear" onClick={handleClear}>
              Limpar filtros
            </button>
            <button type="button" className="properties-filter-btn-apply" onClick={handleApply}>
              Aplicar
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
