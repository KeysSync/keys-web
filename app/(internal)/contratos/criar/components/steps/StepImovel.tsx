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
import { mockImoveis, type Imovel, type ImovelTipo } from '@/lib/mocks/imoveis'
import {
  getContratoWizardDraft,
  selectContratoWizardImovel,
  setContratoWizardSearchMode,
} from '@/lib/contratos/wizard/draft'
import type { ImovelSearchMode } from '@/lib/contratos/wizard/types'

const tipoBadgeLabel: Record<ImovelTipo, string> = {
  residencial: 'Residencial',
  comercial: 'Comercial',
}

const searchModes: { mode: ImovelSearchMode; label: string }[] = [
  { mode: 'sistema', label: 'Ref. sistema' },
  { mode: 'imobiliaria', label: 'Ref. imobiliária' },
  { mode: 'logradouro', label: 'Endereço' },
]

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function filterImovel(imovel: Imovel, query: string, mode: ImovelSearchMode) {
  const q = query.trim().toLowerCase()
  if (!q) return true

  if (mode === 'sistema') {
    return (
      imovel.refSistema.toLowerCase().includes(q) ||
      imovel.codigo.toLowerCase().includes(q)
    )
  }

  if (mode === 'imobiliaria') {
    return (
      imovel.refImobiliaria.toLowerCase().includes(q) ||
      imovel.codigo.toLowerCase().includes(q) ||
      imovel.titulo.toLowerCase().includes(q)
    )
  }

  return (
    imovel.logradouro.toLowerCase().includes(q) ||
    imovel.bairro.toLowerCase().includes(q) ||
    imovel.cidade.toLowerCase().includes(q)
  )
}

interface StepImovelProps {
  selectedId: string | null
  onSelect: (imovelId: string) => void
}

export function StepImovel({ selectedId, onSelect }: StepImovelProps) {
  const draft = getContratoWizardDraft()
  const [search, setSearch] = useState('')
  const [searchMode, setSearchMode] = useState<ImovelSearchMode>(
    draft.imovelSearchMode,
  )

  const filtered = useMemo(
    () => mockImoveis.filter((imovel) => filterImovel(imovel, search, searchMode)),
    [search, searchMode],
  )

  function handleSearchModeChange(mode: ImovelSearchMode) {
    setSearchMode(mode)
    setContratoWizardSearchMode(mode)
  }

  function handleSelect(imovelId: string) {
    onSelect(imovelId)
    selectContratoWizardImovel(imovelId)
  }

  return (
    <section className="contrato-criar-step-imovel">
      <div className="contrato-criar-toolbar">
        <div className="contrato-criar-segmented" role="tablist" aria-label="Buscar por">
          {searchModes.map(({ mode, label }) => (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={searchMode === mode}
              className={`contrato-criar-segmented__btn${searchMode === mode ? ' contrato-criar-segmented__btn--active' : ''}`}
              onClick={() => handleSearchModeChange(mode)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="contrato-criar-toolbar__actions">
          <label className="contrato-criar-search-field">
            <Search size={18} className="contrato-criar-search-icon" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar imóvel…"
            />
          </label>
          <button type="button" className="contrato-criar-btn-ghost">
            <Plus size={18} />
            Cadastrar
          </button>
        </div>
      </div>

      <div className="contrato-criar-callout" role="note">
        <Info size={18} aria-hidden />
        <p>
          Revise o cadastro do imóvel antes de avançar — dados completos agilizam as
          próximas etapas do contrato.
        </p>
      </div>

      <p className="contrato-criar-results-meta">
        {filtered.length} {filtered.length === 1 ? 'imóvel' : 'imóveis'}
        {search.trim() ? ' encontrados' : ' disponíveis'}
      </p>

      <ul className="contrato-criar-imovel-list">
        {filtered.length === 0 ? (
          <li className="contrato-criar-imovel-empty">
            <Building2 size={32} aria-hidden />
            <p>Nenhum imóvel corresponde à busca.</p>
            <span>Tente outro filtro ou termo.</span>
          </li>
        ) : (
          filtered.map((imovel) => {
            const isSelected = selectedId === imovel.id

            return (
              <li key={imovel.id}>
                <button
                  type="button"
                  className={`contrato-criar-imovel-card${isSelected ? ' contrato-criar-imovel-card--selected' : ''}`}
                  onClick={() => handleSelect(imovel.id)}
                  aria-pressed={isSelected}
                >
                  <span className="contrato-criar-imovel-card__select" aria-hidden>
                    {isSelected ? (
                      <CheckCircle2 size={22} className="contrato-criar-imovel-card__check" />
                    ) : (
                      <Circle size={22} className="contrato-criar-imovel-card__circle" />
                    )}
                  </span>

                  <span className="contrato-criar-imovel-card__thumb">
                    <Building2 size={24} />
                  </span>

                  <span className="contrato-criar-imovel-card__body">
                    <span className="contrato-criar-imovel-card__row">
                      <span className="contrato-criar-imovel-card__title">{imovel.titulo}</span>
                      <span className="contrato-criar-imovel-tag">
                        {tipoBadgeLabel[imovel.tipo]}
                      </span>
                    </span>
                    <span className="contrato-criar-imovel-card__address">
                      <MapPin size={14} aria-hidden />
                      {imovel.logradouro}
                    </span>
                    <span className="contrato-criar-imovel-card__refs">
                      <span>Ref. imob. {imovel.refImobiliaria}</span>
                      <span aria-hidden>·</span>
                      <span>Sistema {imovel.refSistema}</span>
                    </span>
                  </span>

                  <span className="contrato-criar-imovel-card__price">
                    <span className="contrato-criar-imovel-card__price-value">
                      {formatCurrency(imovel.valorAluguel)}
                    </span>
                    <span className="contrato-criar-imovel-card__price-period">/ mês</span>
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
