'use client'

import { useMemo, useState } from 'react'
import {
  Building2,
  CheckCircle2,
  Circle,
  Info,
  MapPin,
  Plus,
  Search,
} from 'lucide-react'
import {
  type ContractPropertySummary,
  type ContractPropertyType,
} from '@/lib/contracts/property-summary'
import {
  getContractWizardDraft,
  selectContractWizardProperty,
  setContractWizardSearchMode,
} from '@/lib/contracts/wizard/draft'
import type { PropertySearchMode } from '@/lib/contracts/wizard/types'

const typeBadgeLabel: Record<ContractPropertyType, string> = {
  residential: 'Residencial',
  commercial: 'Comercial',
}

const searchModes: { mode: PropertySearchMode; label: string }[] = [
  { mode: 'system', label: 'Ref. sistema' },
  { mode: 'agency', label: 'Ref. imobiliária' },
  { mode: 'street', label: 'Endereço' },
]

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function filterProperty(property: ContractPropertySummary, query: string, mode: PropertySearchMode) {
  const q = query.trim().toLowerCase()
  if (!q) return true

  if (mode === 'system') {
    return (
      property.systemRef.toLowerCase().includes(q) ||
      property.code.toLowerCase().includes(q)
    )
  }

  if (mode === 'agency') {
    return (
      property.agencyRef.toLowerCase().includes(q) ||
      property.code.toLowerCase().includes(q) ||
      property.title.toLowerCase().includes(q)
    )
  }

  return (
    property.street.toLowerCase().includes(q) ||
    property.neighborhood.toLowerCase().includes(q) ||
    property.city.toLowerCase().includes(q)
  )
}

interface StepPropertyProps {
  properties: ContractPropertySummary[]
  selectedId: string | null
  onSelect: (propertyId: string) => void
}

export function StepProperty({ properties, selectedId, onSelect }: StepPropertyProps) {
  const draft = getContractWizardDraft()
  const [search, setSearch] = useState('')
  const [searchMode, setSearchMode] = useState<PropertySearchMode>(
    draft.propertySearchMode,
  )

  const filtered = useMemo(
    () => properties.filter((property) => filterProperty(property, search, searchMode)),
    [properties, search, searchMode],
  )

  function handleSearchModeChange(mode: PropertySearchMode) {
    setSearchMode(mode)
    setContractWizardSearchMode(mode)
  }

  function handleSelect(propertyId: string) {
    onSelect(propertyId)
    selectContractWizardProperty(propertyId)
  }

  return (
    <section className="contract-create-step-property">
      <div className="contract-create-toolbar">
        <div className="contract-create-segmented" role="tablist" aria-label="Buscar por">
          {searchModes.map(({ mode, label }) => (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={searchMode === mode}
              className={`contract-create-segmented__btn${searchMode === mode ? ' contract-create-segmented__btn--active' : ''}`}
              onClick={() => handleSearchModeChange(mode)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="contract-create-toolbar__actions">
          <label className="contract-create-search-field">
            <Search size={18} className="contract-create-search-icon" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar imóvel…"
            />
          </label>
          <button type="button" className="contract-create-btn-ghost">
            <Plus size={18} />
            Cadastrar
          </button>
        </div>
      </div>

      <div className="contract-create-callout" role="note">
        <Info size={18} aria-hidden />
        <p>
          Revise o cadastro do imóvel antes de avançar — dados completos agilizam as
          próximas etapas do contrato.
        </p>
      </div>

      <p className="contract-create-results-meta">
        {filtered.length} {filtered.length === 1 ? 'imóvel' : 'imóveis'}
        {search.trim() ? ' encontrados' : ' disponíveis'}
      </p>

      <ul className="contract-create-property-list">
        {filtered.length === 0 ? (
          <li className="contract-create-property-empty">
            <Building2 size={32} aria-hidden />
            <p>Nenhum imóvel corresponde à busca.</p>
            <span>Tente outro filtro ou termo.</span>
          </li>
        ) : (
          filtered.map((property) => {
            const isSelected = selectedId === property.id

            return (
              <li key={property.id}>
                <button
                  type="button"
                  className={`contract-create-property-card${isSelected ? ' contract-create-property-card--selected' : ''}`}
                  onClick={() => handleSelect(property.id)}
                  aria-pressed={isSelected}
                >
                  <span className="contract-create-property-card__select" aria-hidden>
                    {isSelected ? (
                      <CheckCircle2 size={22} className="contract-create-property-card__check" />
                    ) : (
                      <Circle size={22} className="contract-create-property-card__circle" />
                    )}
                  </span>

                  <span className="contract-create-property-card__thumb">
                    <Building2 size={24} />
                  </span>

                  <span className="contract-create-property-card__body">
                    <span className="contract-create-property-card__row">
                      <span className="contract-create-property-card__title">{property.title}</span>
                      <span className="contract-create-property-tag">
                        {typeBadgeLabel[property.type]}
                      </span>
                    </span>
                    <span className="contract-create-property-card__address">
                      <MapPin size={14} aria-hidden />
                      {property.street}
                    </span>
                    <span className="contract-create-property-card__refs">
                      <span>Ref. imob. {property.agencyRef}</span>
                      <span aria-hidden>·</span>
                      <span>Sistema {property.systemRef}</span>
                    </span>
                  </span>

                  <span className="contract-create-property-card__price">
                    <span className="contract-create-property-card__price-value">
                      {formatCurrency(property.rentAmount)}
                    </span>
                    <span className="contract-create-property-card__price-period">/ mês</span>
                  </span>
                </button>
              </li>
            )
          })
        )}
      </ul>
    </section>
  )
}
