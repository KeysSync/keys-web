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
import type { TenantListRow } from '@/lib/tenants/api'
import {
  getContractWizardDraft,
  patchContractTenantsData,
} from '@/lib/contracts/wizard/draft'
import {
  defaultContractTenantsData,
  TENANT_ROLE_OPTIONS,
  type ContractTenantLink,
  type ContractTenantsData,
  type TenantRole,
} from '@/lib/contracts/wizard/contract-tenants'
import { ContractSelect } from '@/app/components/ContractSelect/ContractSelect'

function filterTenant(tenant: TenantListRow, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    tenant.name.toLowerCase().includes(q) ||
    tenant.document.toLowerCase().includes(q) ||
    tenant.email.toLowerCase().includes(q) ||
    tenant.phone.toLowerCase().includes(q)
  )
}

export function StepTenants({ tenants }: { tenants: TenantListRow[] }) {
  const [data, setData] = useState<ContractTenantsData>(() => {
    const draft = getContractWizardDraft()
    return {
      ...defaultContractTenantsData(),
      ...draft.tenants,
    links: draft.tenants?.links ?? [],
    }
  })
  const [search, setSearch] = useState('')

  const linkIds = useMemo(
    () => new Set(data.links.map((link) => link.tenantId)),
    [data.links],
  )

  const selectedTenants = useMemo(
    () =>
      data.links
        .map((link) => {
          const tenant = tenants.find((renter) => renter.id === link.tenantId)
          return tenant ? { ...link, tenant } : null
        })
        .filter(Boolean) as (ContractTenantLink & { tenant: TenantListRow })[],
    [data.links, tenants],
  )

  const available = useMemo(
    () =>
      tenants.filter(
        (tenant) =>
          !linkIds.has(tenant.id) && filterTenant(tenant, search),
      ),
    [tenants, search, linkIds],
  )

  function persist(next: ContractTenantsData) {
    setData(next)
    patchContractTenantsData(next)
  }

  function addTenant(tenantId: string) {
    const hasPrincipal = data.links.some((link) => link.role === 'principal')
    const links: ContractTenantLink[] = [
      ...data.links,
      {
        tenantId,
        role: hasPrincipal ? 'occupant' : 'principal',
      },
    ]
    persist({ links })
  }

  function removeTenant(tenantId: string) {
    let links = data.links.filter((link) => link.tenantId !== tenantId)
    const hadPrincipal = data.links.some(
      (link) => link.tenantId === tenantId && link.role === 'principal',
    )
    if (hadPrincipal && links.length > 0 && !links.some((link) => link.role === 'principal')) {
      links = links.map((link, index) =>
        index === 0 ? { ...link, role: 'principal' as const } : link,
      )
    }
    persist({ links })
  }

  function setRole(tenantId: string, role: TenantRole) {
    let links = data.links.map((link) =>
      link.tenantId === tenantId ? { ...link, role } : link,
    )

    if (role === 'principal') {
      links = links.map((link) =>
        link.tenantId === tenantId
          ? link
          : link.role === 'principal'
            ? { ...link, role: 'occupant' as const }
            : link,
      )
    }

    persist({ links })
  }

  return (
    <div className="contract-create-step-locatarios">
      <div className="contract-create-locatarios-grid">
        <section className="contract-create-locatarios-panel">
          <header className="contract-create-locatarios-panel__head">
            <h3 className="contract-create-locatarios-panel__title">Adicionar locatários</h3>
            <button type="button" className="contract-create-btn-ghost contract-create-btn-ghost--compact">
              <UserPlus size={18} />
              Cadastrar
            </button>
          </header>

          <div className="contract-create-locatarios-panel__toolbar">
            <label className="contract-create-search-field contract-create-search-field--panel">
              <Search size={18} className="contract-create-search-icon" aria-hidden />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, documento ou contato…"
              />
            </label>
            <p className="contract-create-results-meta">
              {available.length}{' '}
              {available.length === 1 ? 'pessoa disponível' : 'pessoas disponíveis'}
            </p>
          </div>

          <div className="contract-create-locatarios-panel__scroll">
            <ul className="contract-create-locatarios-pick-list">
              {available.length === 0 ? (
                <li className="contract-create-property-empty">
                  <User size={32} aria-hidden />
                  <p>Ninguém encontrado para adicionar.</p>
                  <span>Ajuste a busca ou cadastre um novo inquilino.</span>
                </li>
              ) : (
                available.map((tenant) => (
                  <li key={tenant.id} className="contract-create-locatario-pick">
                    <div className="contract-create-locatario-pick__avatar">
                      <User size={20} />
                    </div>
                    <div className="contract-create-locatario-pick__body">
                      <p className="contract-create-locatario-pick__name">{tenant.name}</p>
                      <p className="contract-create-locatario-pick__doc">{tenant.document}</p>
                      <p className="contract-create-locatario-pick__contact">
                        <Mail size={13} aria-hidden />
                        {tenant.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="contract-create-locatario-pick__add"
                      onClick={() => addTenant(tenant.id)}
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

        <section className="contract-create-locatarios-panel contract-create-locatarios-panel--selected">
          <header className="contract-create-locatarios-panel__head">
            <h3 className="contract-create-locatarios-panel__title">
              No contrato ({selectedTenants.length})
            </h3>
          </header>

          <div className="contract-create-locatarios-panel__body">
            {selectedTenants.length === 0 ? (
              <div className="contract-create-locatarios-empty">
                <Star size={28} aria-hidden />
                <p>Nenhum locatário vinculado ainda.</p>
                <span>Adicione pelo menos um locatário principal para o contrato.</span>
              </div>
            ) : (
              <ul className="contract-create-locatarios-selected-list">
                {selectedTenants.map(({ tenant, role, tenantId }) => (
                <li key={tenantId} className="contract-create-locatario-selected">
                  <div className="contract-create-locatario-selected__top">
                    <div>
                      <p className="contract-create-locatario-selected__name">
                        {tenant.name}
                        {role === 'principal' ? (
                          <span className="contract-create-locatario-selected__badge">
                            Principal
                          </span>
                        ) : null}
                      </p>
                      <p className="contract-create-locatario-selected__doc">
                        {tenant.document}
                        <span>·</span>
                        {tenant.type === 'pf' ? 'Pessoa física' : 'Pessoa jurídica'}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="contract-create-locatario-selected__remove"
                      onClick={() => removeTenant(tenantId)}
                      aria-label={`Remover ${tenant.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="contract-create-locatario-selected__meta">
                    <span>
                      <Phone size={13} aria-hidden />
                      {tenant.phone}
                    </span>
                    <span>
                      <Mail size={13} aria-hidden />
                      {tenant.email}
                    </span>
                  </div>

                  <label className="contract-create-locatario-selected__papel">
                    <span>Papel no contrato</span>
                    <ContractSelect
                      value={role}
                      options={TENANT_ROLE_OPTIONS}
                      onChange={(v) => setRole(tenantId, v as TenantRole)}
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
