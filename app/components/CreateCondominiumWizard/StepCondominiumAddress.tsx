'use client'

import { EntityFormField } from '@/app/components/EntityForm/EntityFormField'
import { FormSection } from '@/app/components/FormSection/FormSection'
import { CepInputBr } from '@/components/ui/cep-input-br'
import type {
  CondominiumAddressFormData,
  CondominiumFormData,
  CondominiumFormErrors,
} from '@/lib/condominiums/types'

interface StepCondominiumAddressProps {
  data: CondominiumFormData
  errors: CondominiumFormErrors
  patchAddress: (partial: Partial<CondominiumAddressFormData>) => void
  handleCepBlur: () => void
  cepLoading: boolean
}

const inputClass = (hasError?: boolean) =>
  `contract-create-input${hasError ? ' contract-create-input--error' : ''}`

export function StepCondominiumAddress({
  data,
  errors,
  patchAddress,
  handleCepBlur,
  cepLoading,
}: StepCondominiumAddressProps) {
  return (
    <div className="contract-create-step-form">
      <FormSection
        title="Endereço"
        description="Informe o CEP para preencher os campos automaticamente."
      >
        <div className="contract-create-form-grid">
          <EntityFormField
            label="CEP"
            htmlFor="condominio-cep"
            required
            error={errors.postal_code}
          >
            <CepInputBr
              id="condominio-cep"
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
            label="Logradouro"
            htmlFor="condominio-street"
            required
            error={errors.street}
            className="contract-create-field--wide"
          >
            <input
              id="condominio-street"
              type="text"
              className={inputClass(Boolean(errors.street))}
              value={data.address.street}
              onChange={(e) => patchAddress({ street: e.target.value })}
            />
          </EntityFormField>

          <EntityFormField label="Número" htmlFor="condominio-number">
            <input
              id="condominio-number"
              type="text"
              className={inputClass()}
              value={data.address.number}
              onChange={(e) => patchAddress({ number: e.target.value })}
            />
          </EntityFormField>

          <EntityFormField label="Complemento" htmlFor="condominio-complement">
            <input
              id="condominio-complement"
              type="text"
              className={inputClass()}
              value={data.address.complement}
              onChange={(e) => patchAddress({ complement: e.target.value })}
              placeholder="Ex.: Bloco A"
            />
          </EntityFormField>

          <EntityFormField label="Bairro" htmlFor="condominio-neighborhood">
            <input
              id="condominio-neighborhood"
              type="text"
              className={inputClass()}
              value={data.address.neighborhood}
              onChange={(e) => patchAddress({ neighborhood: e.target.value })}
            />
          </EntityFormField>

          <EntityFormField
            label="Cidade"
            htmlFor="condominio-city"
            required
            error={errors.city}
          >
            <input
              id="condominio-city"
              type="text"
              className={inputClass(Boolean(errors.city))}
              value={data.address.city}
              onChange={(e) => patchAddress({ city: e.target.value })}
            />
          </EntityFormField>

          <EntityFormField
            label="Estado (UF)"
            htmlFor="condominio-state"
            required
            error={errors.state}
          >
            <input
              id="condominio-state"
              type="text"
              maxLength={2}
              className={inputClass(Boolean(errors.state))}
              value={data.address.state}
              onChange={(e) =>
                patchAddress({ state: e.target.value.toUpperCase() })
              }
              placeholder="Ex.: SP"
            />
          </EntityFormField>
        </div>
      </FormSection>
    </div>
  )
}
