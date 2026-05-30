'use client'

import { EntityFormField } from '@/app/components/EntityForm/EntityFormField'
import { FormSection } from '@/app/components/FormSection/FormSection'
import type {
  CondominiumFormData,
  CondominiumFormErrors,
} from '@/lib/condominiums/types'

interface StepCondominiumIdentificationProps {
  data: CondominiumFormData
  errors: CondominiumFormErrors
  patch: (partial: Partial<CondominiumFormData>) => void
}

const inputClass = (hasError?: boolean) =>
  `contract-create-input${hasError ? ' contract-create-input--error' : ''}`

export function StepCondominiumIdentification({
  data,
  errors,
  patch,
}: StepCondominiumIdentificationProps) {
  return (
    <div className="contract-create-step-form">
      <FormSection
        title="Identificação"
        description="Código, nome e observações do condomínio."
      >
        <div className="contract-create-form-grid">
          <EntityFormField
            label="Código"
            htmlFor="condominio-code"
            required
            error={errors.code}
          >
            <input
              id="condominio-code"
              type="text"
              className={inputClass(Boolean(errors.code))}
              value={data.code}
              onChange={(e) => patch({ code: e.target.value })}
              placeholder="Ex.: COND-001"
            />
          </EntityFormField>

          <EntityFormField
            label="Nome"
            htmlFor="condominio-name"
            required
            error={errors.name}
            className="contract-create-field--wide"
          >
            <input
              id="condominio-name"
              type="text"
              className={inputClass(Boolean(errors.name))}
              value={data.name}
              onChange={(e) => patch({ name: e.target.value })}
            />
          </EntityFormField>

          <EntityFormField
            label="Observações"
            htmlFor="condominio-obs"
            className="contract-create-field--wide"
          >
            <textarea
              id="condominio-obs"
              className={inputClass()}
              value={data.obs}
              onChange={(e) => patch({ obs: e.target.value })}
              rows={3}
              placeholder="Informações adicionais sobre o condomínio"
            />
          </EntityFormField>
        </div>
      </FormSection>
    </div>
  )
}
