'use client'

import { EntityFormField } from '@/app/components/EntityForm/EntityFormField'
import { FormSection } from '@/app/components/FormSection/FormSection'
import { CepInputBr } from '@/components/ui/cep-input-br'
import { Select } from '@/components/ui/select'
import { STATE_OPTIONS } from '@/lib/proprietarios/constants'
import type {
  ProprietarioFormData,
  ProprietarioFormErrors,
} from '@/lib/proprietarios/types'

interface StepEnderecoProps {
  data: ProprietarioFormData
  errors: ProprietarioFormErrors
  patch: (partial: Partial<ProprietarioFormData>) => void
  handleCepBlur: () => void
  cepLoading: boolean
}

const inputClass = (hasError?: boolean) =>
  `contrato-criar-input${hasError ? ' contrato-criar-input--error' : ''}`

export function StepEndereco({
  data,
  errors,
  patch,
  handleCepBlur,
  cepLoading,
}: StepEnderecoProps) {
  return (
    <div className="contrato-criar-step-form">
      <FormSection
        title="Endereço"
        description="Informe o CEP para preencher logradouro, bairro, cidade e UF automaticamente."
      >
        <div className="contrato-criar-form-grid">
          <EntityFormField
            label="CEP"
            htmlFor="proprietario-cep"
            required
            error={errors.postal_code}
          >
            <CepInputBr
              id="proprietario-cep"
              className={inputClass(Boolean(errors.postal_code))}
              value={data.postal_code}
              onChange={(v) => patch({ postal_code: v })}
              onBlur={handleCepBlur}
            />
            {cepLoading ? (
              <span className="entity-form-cep-hint">Buscando endereço…</span>
            ) : null}
          </EntityFormField>

          <EntityFormField
            label="Logradouro"
            htmlFor="proprietario-street"
            required
            error={errors.street}
            className="contrato-criar-field--wide"
          >
            <input
              id="proprietario-street"
              type="text"
              className={inputClass(Boolean(errors.street))}
              value={data.street}
              onChange={(e) => patch({ street: e.target.value })}
            />
          </EntityFormField>

          <EntityFormField label="Número" htmlFor="proprietario-number">
            <input
              id="proprietario-number"
              type="text"
              className={inputClass()}
              value={data.number}
              onChange={(e) => patch({ number: e.target.value })}
            />
          </EntityFormField>

          <EntityFormField label="Complemento" htmlFor="proprietario-complement">
            <input
              id="proprietario-complement"
              type="text"
              className={inputClass()}
              value={data.complement}
              onChange={(e) => patch({ complement: e.target.value })}
            />
          </EntityFormField>

          <EntityFormField label="Bairro" htmlFor="proprietario-neighborhood">
            <input
              id="proprietario-neighborhood"
              type="text"
              className={inputClass()}
              value={data.neighborhood}
              onChange={(e) => patch({ neighborhood: e.target.value })}
            />
          </EntityFormField>

          <EntityFormField
            label="Cidade"
            htmlFor="proprietario-city"
            required
            error={errors.city}
          >
            <input
              id="proprietario-city"
              type="text"
              className={inputClass(Boolean(errors.city))}
              value={data.city}
              onChange={(e) => patch({ city: e.target.value })}
            />
          </EntityFormField>

          <EntityFormField
            label="Estado (UF)"
            htmlFor="proprietario-state"
            required
            error={errors.state}
          >
            <Select
              id="proprietario-state"
              className={errors.state ? 'keys-ui-select-trigger--error' : undefined}
              placeholder="UF"
              options={[{ value: '', label: 'UF' }, ...STATE_OPTIONS]}
              value={data.state}
              onChange={(e) => patch({ state: e.target.value })}
            />
          </EntityFormField>
        </div>
      </FormSection>
    </div>
  )
}
