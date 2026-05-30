'use client'

import { EntityFormField } from '@/app/components/EntityForm/EntityFormField'
import { FormSection } from '@/app/components/FormSection/FormSection'
import { CepInputBr } from '@/components/ui/cep-input-br'
import type { PropertyAddressFormData, PropertyFormData, PropertyFormErrors } from '@/lib/properties/types'

interface StepPropertyLocationProps {
  data: PropertyFormData
  errors: PropertyFormErrors
  patchAddress: (partial: Partial<PropertyAddressFormData>) => void
  handleCepBlur: () => void
  cepLoading: boolean
}

const inputClass = (hasError?: boolean) =>
  `contract-create-input${hasError ? ' contract-create-input--error' : ''}`

export function StepPropertyLocation({
  data,
  errors,
  patchAddress,
  handleCepBlur,
  cepLoading,
}: StepPropertyLocationProps) {
  return (
    <div className="contract-create-step-form">
      <FormSection
        title="Endereço"
        description="Informe o CEP para preencher os campos automaticamente."
      >
        <div className="contract-create-form-grid">
          <EntityFormField
            label="CEP"
            htmlFor="property-cep"
            required
            error={errors.postal_code}
          >
            <CepInputBr
              id="property-cep"
              className={inputClass(Boolean(errors.postal_code))}
              value={data.address.postal_code}
              onChange={(v) => patchAddress({ postal_code: v })}
              onBlur={handleCepBlur}
            />
            {cepLoading ? (
              <span className="entity-form-cep-hint">Buscando endereço…</span>
            ) : null}
          </EntityFormField>

          <EntityFormField
            label="Endereço"
            htmlFor="property-street"
            required
            error={errors.street}
            className="contract-create-field--wide"
          >
            <input
              id="property-street"
              type="text"
              className={inputClass(Boolean(errors.street))}
              value={data.address.street}
              onChange={(e) => patchAddress({ street: e.target.value })}
            />
          </EntityFormField>

          <EntityFormField
            label="Número"
            htmlFor="property-number"
            required
            error={errors.number}
          >
            <input
              id="property-number"
              type="text"
              className={inputClass(Boolean(errors.number))}
              value={data.address.number}
              onChange={(e) => patchAddress({ number: e.target.value })}
            />
          </EntityFormField>

          <EntityFormField
            label="Complemento"
            htmlFor="property-complement"
            error={errors.complement}
          >
            <input
              id="property-complement"
              type="text"
              className={inputClass(Boolean(errors.complement))}
              value={data.address.complement}
              onChange={(e) => patchAddress({ complement: e.target.value })}
              placeholder="Ex.: Bloco A, Apto 302"
            />
          </EntityFormField>

          <EntityFormField
            label="Bairro"
            htmlFor="property-neighborhood"
            required
            error={errors.neighborhood}
          >
            <input
              id="property-neighborhood"
              type="text"
              className={inputClass(Boolean(errors.neighborhood))}
              value={data.address.neighborhood}
              onChange={(e) => patchAddress({ neighborhood: e.target.value })}
            />
          </EntityFormField>

          <EntityFormField
            label="Cidade"
            htmlFor="property-city"
            required
            error={errors.city}
          >
            <input
              id="property-city"
              type="text"
              className={inputClass(Boolean(errors.city))}
              value={data.address.city}
              onChange={(e) => patchAddress({ city: e.target.value })}
            />
          </EntityFormField>

          <EntityFormField
            label="Estado"
            htmlFor="property-state"
            required
            error={errors.state}
          >
            <input
              id="property-state"
              type="text"
              maxLength={2}
              className={inputClass(Boolean(errors.state))}
              value={data.address.state}
              onChange={(e) => patchAddress({ state: e.target.value.toUpperCase() })}
              placeholder="Ex.: SP"
            />
          </EntityFormField>
        </div>
      </FormSection>
    </div>
  )
}
