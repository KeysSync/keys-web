'use client'

import { useMemo, useState } from 'react'
import {
  Mail,
  Phone,
  Plus,
  Search,
  Star,
  Trash2,
  User,
  UserPlus,
} from 'lucide-react'
import { mockInquilinos, type Inquilino } from '@/lib/mocks/inquilinos'
import {
  getContratoWizardDraft,
  patchContratoLocatariosData,
} from '@/lib/contratos/wizard/draft'
import {
  defaultContratoLocatariosData,
  LOCATARIO_PAPEL_OPTIONS,
  type ContratoLocatarioVinculo,
  type ContratoLocatariosData,
  type LocatarioPapel,
} from '@/lib/contratos/wizard/locatarios'
import { ContratoSelect } from '@/app/components/ContratoSelect/ContratoSelect'

function filterInquilino(inquilino: Inquilino, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    inquilino.nome.toLowerCase().includes(q) ||
    inquilino.documento.toLowerCase().includes(q) ||
    inquilino.email.toLowerCase().includes(q) ||
    inquilino.telefone.toLowerCase().includes(q)
  )
}

export function StepLocatarios() {
  const [data, setData] = useState<ContratoLocatariosData>(() => {
    const draft = getContratoWizardDraft()
    return {
      ...defaultContratoLocatariosData(),
      ...draft.locatarios,
      vinculos: draft.locatarios?.vinculos ?? [],
    }
  })
  const [search, setSearch] = useState('')

  const vinculoIds = useMemo(
    () => new Set(data.vinculos.map((v) => v.inquilinoId)),
    [data.vinculos],
  )

  const selectedInquilinos = useMemo(
    () =>
      data.vinculos
        .map((v) => {
          const inquilino = mockInquilinos.find((i) => i.id === v.inquilinoId)
          return inquilino ? { ...v, inquilino } : null
        })
        .filter(Boolean) as (ContratoLocatarioVinculo & { inquilino: Inquilino })[],
    [data.vinculos],
  )

  const available = useMemo(
    () =>
      mockInquilinos.filter(
        (inquilino) =>
          !vinculoIds.has(inquilino.id) && filterInquilino(inquilino, search),
      ),
    [search, vinculoIds],
  )

  function persist(next: ContratoLocatariosData) {
    setData(next)
    patchContratoLocatariosData(next)
  }

  function addLocatario(inquilinoId: string) {
    const hasPrincipal = data.vinculos.some((v) => v.papel === 'principal')
    const vinculos: ContratoLocatarioVinculo[] = [
      ...data.vinculos,
      {
        inquilinoId,
        papel: hasPrincipal ? 'morador' : 'principal',
      },
    ]
    persist({ vinculos })
  }

  function removeLocatario(inquilinoId: string) {
    let vinculos = data.vinculos.filter((v) => v.inquilinoId !== inquilinoId)
    const hadPrincipal = data.vinculos.some(
      (v) => v.inquilinoId === inquilinoId && v.papel === 'principal',
    )
    if (hadPrincipal && vinculos.length > 0 && !vinculos.some((v) => v.papel === 'principal')) {
      vinculos = vinculos.map((v, index) =>
        index === 0 ? { ...v, papel: 'principal' as const } : v,
      )
    }
    persist({ vinculos })
  }

  function setPapel(inquilinoId: string, papel: LocatarioPapel) {
    let vinculos = data.vinculos.map((v) =>
      v.inquilinoId === inquilinoId ? { ...v, papel } : v,
    )

    if (papel === 'principal') {
      vinculos = vinculos.map((v) =>
        v.inquilinoId === inquilinoId
          ? v
          : v.papel === 'principal'
            ? { ...v, papel: 'morador' as const }
            : v,
      )
    }

    persist({ vinculos })
  }

  return (
    <div className="contrato-criar-step-locatarios">
      <div className="contrato-criar-locatarios-grid">
        <section className="contrato-criar-locatarios-panel">
          <header className="contrato-criar-locatarios-panel__head">
            <h3 className="contrato-criar-locatarios-panel__title">Adicionar locatários</h3>
            <button type="button" className="contrato-criar-btn-ghost contrato-criar-btn-ghost--compact">
              <UserPlus size={18} />
              Cadastrar
            </button>
          </header>

          <div className="contrato-criar-locatarios-panel__toolbar">
            <label className="contrato-criar-search-field contrato-criar-search-field--panel">
              <Search size={18} className="contrato-criar-search-icon" aria-hidden />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, documento ou contato…"
              />
            </label>
            <p className="contrato-criar-results-meta">
              {available.length}{' '}
              {available.length === 1 ? 'pessoa disponível' : 'pessoas disponíveis'}
            </p>
          </div>

          <div className="contrato-criar-locatarios-panel__scroll">
            <ul className="contrato-criar-locatarios-pick-list">
              {available.length === 0 ? (
                <li className="contrato-criar-imovel-empty">
                  <User size={32} aria-hidden />
                  <p>Ninguém encontrado para adicionar.</p>
                  <span>Ajuste a busca ou cadastre um novo inquilino.</span>
                </li>
              ) : (
                available.map((inquilino) => (
                  <li key={inquilino.id} className="contrato-criar-locatario-pick">
                    <div className="contrato-criar-locatario-pick__avatar">
                      <User size={20} />
                    </div>
                    <div className="contrato-criar-locatario-pick__body">
                      <p className="contrato-criar-locatario-pick__name">{inquilino.nome}</p>
                      <p className="contrato-criar-locatario-pick__doc">{inquilino.documento}</p>
                      <p className="contrato-criar-locatario-pick__contact">
                        <Mail size={13} aria-hidden />
                        {inquilino.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="contrato-criar-locatario-pick__add"
                      onClick={() => addLocatario(inquilino.id)}
                    >
                      <Plus size={16} />
                      Adicionar
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>

        <section className="contrato-criar-locatarios-panel contrato-criar-locatarios-panel--selected">
          <header className="contrato-criar-locatarios-panel__head">
            <h3 className="contrato-criar-locatarios-panel__title">
              No contrato ({selectedInquilinos.length})
            </h3>
          </header>

          <div className="contrato-criar-locatarios-panel__body">
            {selectedInquilinos.length === 0 ? (
              <div className="contrato-criar-locatarios-empty">
                <Star size={28} aria-hidden />
                <p>Nenhum locatário vinculado ainda.</p>
                <span>Adicione pelo menos um locatário principal para o contrato.</span>
              </div>
            ) : (
              <ul className="contrato-criar-locatarios-selected-list">
                {selectedInquilinos.map(({ inquilino, papel, inquilinoId }) => (
                <li key={inquilinoId} className="contrato-criar-locatario-selected">
                  <div className="contrato-criar-locatario-selected__top">
                    <div>
                      <p className="contrato-criar-locatario-selected__name">
                        {inquilino.nome}
                        {papel === 'principal' ? (
                          <span className="contrato-criar-locatario-selected__badge">
                            Principal
                          </span>
                        ) : null}
                      </p>
                      <p className="contrato-criar-locatario-selected__doc">
                        {inquilino.documento}
                        <span>·</span>
                        {inquilino.tipo === 'pf' ? 'Pessoa física' : 'Pessoa jurídica'}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="contrato-criar-locatario-selected__remove"
                      onClick={() => removeLocatario(inquilinoId)}
                      aria-label={`Remover ${inquilino.nome}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="contrato-criar-locatario-selected__meta">
                    <span>
                      <Phone size={13} aria-hidden />
                      {inquilino.telefone}
                    </span>
                    <span>
                      <Mail size={13} aria-hidden />
                      {inquilino.email}
                    </span>
                  </div>

                  <label className="contrato-criar-locatario-selected__papel">
                    <span>Papel no contrato</span>
                    <ContratoSelect
                      value={papel}
                      options={LOCATARIO_PAPEL_OPTIONS}
                      onChange={(v) => setPapel(inquilinoId, v as LocatarioPapel)}
                    />
                  </label>
                </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
