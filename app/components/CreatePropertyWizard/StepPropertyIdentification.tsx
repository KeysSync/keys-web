'use client'

import { EntityFormField } from '@/app/components/EntityForm/EntityFormField'
import { FormSection } from '@/app/components/FormSection/FormSection'
import { SelectField } from '@/components/ui/select'
import type { Category, Subcategory } from '@/lib/properties/api'
import type { PropertyFormData, PropertyFormErrors } from '@/lib/properties/types'
import { useCallback, useMemo } from 'react'

interface StepPropertyIdentificationProps {
  data: PropertyFormData
  errors: PropertyFormErrors
  patch: (partial: Partial<PropertyFormData>) => void
  categories: Category[]
  subcategories: Subcategory[]
}

const inputClass = (hasError?: boolean) =>
  `contract-create-input${hasError ? ' contract-create-input--error' : ''}`

const STATUS_OPTIONS = [
  { value: 'available', label: 'Disponível' },
  { value: 'rented', label: 'Alugado' },
  { value: 'repairing', label: 'Manutenção' },
]

export function StepPropertyIdentification({
  data,
  errors,
  patch,
  categories,
  subcategories,
}: StepPropertyIdentificationProps) {
  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: String(c.id), label: c.name })),
    [categories],
  )

  const subcategoryOptions = useMemo(() => {
    if (!data.category_id) return []
    return subcategories
      .filter((s) => s.category_id === data.category_id)
      .map((s) => ({ value: String(s.id), label: s.name }))
  }, [data.category_id, subcategories])

  function handleCategoryChange(categoryId: number) {
    patch({ category_id: categoryId, subcategory_id: 0 })
  }

  const formatCurrencyInput = useCallback((raw: string): string => {
    const digits = raw.replace(/\D/g, '')
    if (!digits) return ''
    const cents = Number(digits) / 100
    return cents.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }, [])

  const displayRentPrice = useMemo(() => {
    if (!data.rent_price) return ''
    return data.rent_price.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }, [data.rent_price])

  function handleRentPriceChange(raw: string) {
    const digits = raw.replace(/\D/g, '')
    if (!digits) {
      patch({ rent_price: 0 })
      return
    }
    patch({ rent_price: Number(digits) / 100 })
  }

  return (
    <div className="contract-create-step-form">
      <FormSection
        title="Identificação do imóvel"
        description="Código interno, status e valor do aluguel."
      >
        <div className="contract-create-form-grid">
          <EntityFormField
            label="Código"
            htmlFor="property-code"
            required
            error={errors.code}
          >
            <input
              id="property-code"
              type="text"
              className={inputClass(Boolean(errors.code))}
              value={data.code}
              onChange={(e) => patch({ code: e.target.value })}
              placeholder="Ex.: IMB-001"
            />
          </EntityFormField>

          <EntityFormField
            label="Valor do aluguel"
            htmlFor="property-rent-price"
            error={errors.rent_price}
          >
            <input
              id="property-rent-price"
              type="text"
              inputMode="numeric"
              className={inputClass(Boolean(errors.rent_price))}
              value={displayRentPrice}
              onChange={(e) => handleRentPriceChange(e.target.value)}
              placeholder="0,00"
            />
          </EntityFormField>

          <SelectField
            label="Status"
            value={data.status}
            onChange={(e) => patch({ status: e.target.value })}
            options={STATUS_OPTIONS}
            placeholder="Selecione o status"
            fieldClassName="contract-create-field"
            labelClassName="contract-create-field__label"
          />
        </div>
      </FormSection>

      <FormSection
        title="Classificação"
        description="Categoria e subcategoria do imóvel."
      >
        <div className="contract-create-form-grid">
          <SelectField
            label="Categoria"
            value={data.category_id ? String(data.category_id) : ''}
            onChange={(e) => handleCategoryChange(Number(e.target.value) || 0)}
            options={categoryOptions}
            placeholder="Selecione a categoria"
            fieldClassName="contract-create-field"
            labelClassName="contract-create-field__label"
          />

          <SelectField
            label="Subcategoria"
            value={data.subcategory_id ? String(data.subcategory_id) : ''}
            onChange={(e) => patch({ subcategory_id: Number(e.target.value) || 0 })}
            options={subcategoryOptions}
            placeholder={data.category_id ? 'Selecione a subcategoria' : 'Selecione a categoria primeiro'}
            disabled={!data.category_id}
            fieldClassName="contract-create-field"
            labelClassName="contract-create-field__label"
          />
        </div>
      </FormSection>
    </div>
  )
}
