'use client'

import { useState } from 'react'
import { getContractWizardDraft, patchContractGuaranteeData } from '@/lib/contracts/wizard/draft'
import {
  defaultContractGuaranteeData,
  GUARANTEE_TYPE_OPTIONS,
  type ContractGuaranteeData,
  type GuaranteeType,
} from '@/lib/contracts/wizard/guarantee'
import { CurrencyInputBr } from '@/components/ui/currency-input-br'
import { DocumentInputBr } from '@/components/ui/document-input-br'
import { ContractSelect } from '@/app/components/ContractSelect/ContractSelect'
import { FormDateRange } from '@/app/components/FormDateRange/FormDateRange'
import { FormField } from '@/app/components/FormField/FormField'
import { FormSection } from '@/app/components/FormSection/FormSection'

const inputClass = 'contract-create-input'

export function StepGuarantee() {
  const [data, setData] = useState<ContractGuaranteeData>(() => {
    const draft = getContractWizardDraft()
    return { ...defaultContractGuaranteeData(), ...draft.guarantee }
  })

  function patch(partial: Partial<ContractGuaranteeData>) {
    setData((prev) => {
      const next = { ...prev, ...partial }
      patchContractGuaranteeData(next)
      return next
    })
  }

  const showFiador = data.type === 'guarantor'
  const showValor =
    data.type !== 'none' && data.type !== 'guarantor'

  return (
    <div className="contract-create-step-form">
      <FormSection
        title="Garantia locatícia"
        description="Defina o tipo de garantia exigida neste contrato."
      >
        <div className="contract-create-form-row">
          <FormField
            label="Tipo de garantia"
            htmlFor="tipo-garantia"
            className="contract-create-field--grow"
          >
            <ContractSelect
              id="tipo-garantia"
              value={data.type}
              options={GUARANTEE_TYPE_OPTIONS}
              onChange={(v) => patch({ type: v as GuaranteeType })}
            />
          </FormField>

          {showValor ? (
            <FormField
              label="Valor da garantia (R$)"
              htmlFor="valor-garantia"
              className="contract-create-field--currency"
            >
              <CurrencyInputBr
                id="valor-garantia"
                value={data.amount}
                onChange={(v) => patch({ amount: v })}
              />
            </FormField>
          ) : null}

          <FormDateRange
            startLabel="Vigência — início"
            endLabel="Vigência — fim"
            startId="garantia-inicio"
            endId="garantia-fim"
            startValue={data.validFrom}
            endValue={data.validUntil}
            onStartChange={(iso) => patch({ validFrom: iso })}
            onEndChange={(iso) => patch({ validUntil: iso })}
          />
        </div>
      </FormSection>

      {showFiador ? (
        <FormSection title="Dados do fiador">
          <div className="contract-create-form-row">
            <FormField
              label="Nome do fiador"
              htmlFor="fiador-nome"
              className="contract-create-field--half"
            >
              <input
                id="fiador-nome"
                type="text"
                className={inputClass}
                value={data.guarantorName}
                onChange={(e) => patch({ guarantorName: e.target.value })}
              />
            </FormField>
            <FormField
              label="CPF/CNPJ"
              htmlFor="fiador-doc"
              className="contract-create-field--half"
            >
              <DocumentInputBr
                id="fiador-doc"
                value={data.guarantorDocument}
                onChange={(v) => patch({ guarantorDocument: v })}
              />
            </FormField>
          </div>
        </FormSection>
      ) : null}

      <FormSection title="Observações">
        <FormField label="Anotações sobre a garantia" htmlFor="garantia-obs">
          <textarea
            id="garantia-obs"
            className="contract-create-textarea"
            rows={3}
            value={data.notes}
            onChange={(e) => patch({ notes: e.target.value })}
            placeholder="Ex.: prazo para apresentação da apólice, documentos exigidos…"
          />
        </FormField>
      </FormSection>
    </div>
  )
}
