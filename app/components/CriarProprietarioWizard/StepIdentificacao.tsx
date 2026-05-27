'use client'

import { EntityFormField } from '@/app/components/EntityForm/EntityFormField'
import { FormSection } from '@/app/components/FormSection/FormSection'
import { Checkbox } from '@/app/components/Checkbox/Checkbox'
import { DocumentInputBr } from '@/components/ui/document-input-br'
import { Select } from '@/components/ui/select'
import { PROPRIETARIO_TYPE_OPTIONS } from '@/lib/proprietarios/constants'
import type {
  ProprietarioFormData,
  ProprietarioFormErrors,
  ProprietarioType,
} from '@/lib/proprietarios/types'

interface StepIdentificacaoProps {
  data: ProprietarioFormData
  errors: ProprietarioFormErrors
  patch: (partial: Partial<ProprietarioFormData>) => void
  hideIsRenterToggle?: boolean
}

const inputClass = (hasError?: boolean) =>
  `contrato-criar-input${hasError ? ' contrato-criar-input--error' : ''}`

export function StepIdentificacao({
  data,
  errors,
  patch,
  hideIsRenterToggle = false,
}: StepIdentificacaoProps) {
  const isPerson = data.type === 'person'

  return (
    <div className="contrato-criar-step-form">
      <FormSection
        title="Identificação"
        description="Tipo de pessoa e dados principais de contato."
      >
        <div className="contrato-criar-form-grid">
          <EntityFormField
            label="Tipo"
            htmlFor="proprietario-type"
            required
            error={errors.type}
            className="contrato-criar-field--wide"
          >
            <Select
              id="proprietario-type"
              className={errors.type ? 'keys-ui-select-trigger--error' : undefined}
              options={[...PROPRIETARIO_TYPE_OPTIONS]}
              value={data.type}
              onChange={(e) => {
                const type = e.target.value as ProprietarioType
                patch({
                  type,
                  marriage_regime: type === 'enterprise' ? '' : data.marriage_regime,
                  partner: type === 'enterprise' ? '' : data.partner,
                  civil_status: type === 'enterprise' ? '' : data.civil_status,
                })
              }}
            />
          </EntityFormField>

          <EntityFormField
            label={isPerson ? 'Nome completo' : 'Razão social'}
            htmlFor="proprietario-name"
            required
            error={errors.name}
            className="contrato-criar-field--wide"
          >
            <input
              id="proprietario-name"
              type="text"
              className={inputClass(Boolean(errors.name))}
              value={data.name}
              onChange={(e) => patch({ name: e.target.value })}
              autoComplete="name"
            />
          </EntityFormField>

          <EntityFormField
            label="E-mail"
            htmlFor="proprietario-email"
            required
            error={errors.email}
          >
            <input
              id="proprietario-email"
              type="email"
              className={inputClass(Boolean(errors.email))}
              value={data.email}
              onChange={(e) => patch({ email: e.target.value })}
              autoComplete="email"
            />
          </EntityFormField>

          <EntityFormField
            label={isPerson ? 'CPF' : 'CNPJ'}
            htmlFor="proprietario-document"
            required
            error={errors.document}
          >
            <DocumentInputBr
              id="proprietario-document"
              className={inputClass(Boolean(errors.document))}
              value={data.document}
              onChange={(v) => patch({ document: v })}
              placeholder={isPerson ? '000.000.000-00' : '00.000.000/0000-00'}
            />
          </EntityFormField>

          {!hideIsRenterToggle && (
            <EntityFormField label="Perfil" className="contrato-criar-field--wide">
              <Checkbox
                label="É inquilino?"
                checked={data.is_renter}
                onChange={(e) => patch({ is_renter: e.target.checked })}
              />
            </EntityFormField>
          )}
        </div>
      </FormSection>
    </div>
  )
}
