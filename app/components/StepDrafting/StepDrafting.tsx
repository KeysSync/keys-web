'use client'

import { useMemo, useState } from 'react'
import { FileText } from 'lucide-react'
import { getContractWizardDraft, patchContractDraftingData } from '@/lib/contracts/wizard/draft'
import {
  CONTRACT_MODEL_OPTIONS,
  defaultContractDraftingData,
  type ContractDraftingData,
} from '@/lib/contracts/wizard/drafting'
import type { ContractPropertySummary } from '@/lib/contracts/property-summary'
import type { TenantListRow } from '@/lib/tenants/api'
import { ContractSelect } from '@/app/components/ContractSelect/ContractSelect'
import { FormField } from '@/app/components/FormField/FormField'
import { FormSection } from '@/app/components/FormSection/FormSection'

const MODELO_OPTIONS = CONTRACT_MODEL_OPTIONS.map((opt) => ({
  value: opt.id,
  label: opt.label,
}))

export function StepDrafting({
  properties,
  tenants,
}: {
  properties: ContractPropertySummary[]
  tenants: TenantListRow[]
}) {
  const [data, setData] = useState<ContractDraftingData>(() => {
    const draft = getContractWizardDraft()
    return { ...defaultContractDraftingData(), ...draft.drafting }
  })

  function patch(partial: Partial<ContractDraftingData>) {
    setData((prev) => {
      const next = { ...prev, ...partial }
      patchContractDraftingData(next)
      return next
    })
  }

  const resumo = useMemo(() => {
    const draft = getContractWizardDraft()
    const property = properties.find((i) => i.id === draft.propertyId)
    const principal = draft.tenants.links.find((v) => v.role === 'principal')
    const tenant = tenants.find((i) => i.id === principal?.tenantId)
    const modelo = CONTRACT_MODEL_OPTIONS.find((m) => m.id === data.templateId)

    return {
      propertyTitle: property?.title ?? '—',
      tenant: tenant?.name ?? '—',
      template: modelo?.label ?? '—',
      startDate: draft.general.contractStartDate
        ? new Date(draft.general.contractStartDate + 'T12:00:00').toLocaleDateString('pt-BR')
        : '—',
      rentAmount:
        typeof draft.general.rentAmount === 'number'
          ? draft.general.rentAmount.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })
          : '—',
    }
  }, [data.templateId, properties, tenants])

  return (
    <div className="contract-create-step-form">
      <FormSection
        title="Modelo e redação"
        description="Escolha o modelo base e complemente com cláusulas específicas."
      >
        <div className="contract-create-form-grid">
          <FormField label="Modelo de contrato" htmlFor="modelo" className="contract-create-field--wide">
            <ContractSelect
              id="modelo"
              value={data.templateId}
              options={MODELO_OPTIONS}
              onChange={(v) => patch({ templateId: v })}
            />
          </FormField>
        </div>

        <FormField label="Cláusulas adicionais" htmlFor="clausulas">
          <textarea
            id="clausulas"
            className="contract-create-textarea contract-create-textarea--tall"
            rows={6}
            value={data.additionalClauses}
            onChange={(e) => patch({ additionalClauses: e.target.value })}
            placeholder="Texto livre para cláusulas especiais acordadas entre as partes…"
          />
        </FormField>

        <div className="contract-create-checklist">
          <label className="contract-create-check">
            <input
              type="checkbox"
              checked={data.includeInspectionAnnex}
              onChange={(e) => patch({ includeInspectionAnnex: e.target.checked })}
            />
            Incluir anexo de vistoria de entrada
          </label>
          <label className="contract-create-check">
            <input
              type="checkbox"
              checked={data.includeRulesAnnex}
              onChange={(e) => patch({ includeRulesAnnex: e.target.checked })}
            />
            Incluir regulamento interno / convenção
          </label>
        </div>
      </FormSection>

      <FormSection title="Resumo para conferência">
        <div className="contract-create-redacao-resumo">
          <FileText size={20} aria-hidden />
          <dl>
            <div>
              <dt>Imóvel</dt>
              <dd>{resumo.propertyTitle}</dd>
            </div>
            <div>
              <dt>Locatário principal</dt>
              <dd>{resumo.tenant}</dd>
            </div>
            <div>
              <dt>Início</dt>
              <dd>{resumo.startDate}</dd>
            </div>
            <div>
              <dt>Aluguel</dt>
              <dd>{resumo.rentAmount}</dd>
            </div>
            <div>
              <dt>Modelo</dt>
              <dd>{resumo.template}</dd>
            </div>
          </dl>
        </div>
      </FormSection>

      <FormSection title="Observações internas">
        <FormField label="Uso da imobiliária (não impresso no contrato)" htmlFor="obs-interna">
          <textarea
            id="obs-interna"
            className="contract-create-textarea"
            rows={3}
            value={data.internalNotes}
            onChange={(e) => patch({ internalNotes: e.target.value })}
          />
        </FormField>
      </FormSection>
    </div>
  )
}
