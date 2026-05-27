'use client'

import { EntityFormField } from '@/app/components/EntityForm/EntityFormField'
import { FormSection } from '@/app/components/FormSection/FormSection'
import { CepInputBr } from '@/components/ui/cep-input-br'
import type { ImovelAddressFormData, ImovelFormData, ImovelFormErrors } from '@/lib/imoveis/types'

interface StepImovelLocalizacaoProps {
  data: ImovelFormData
  errors: ImovelFormErrors
  patchAddress: (partial: Partial<ImovelAddressFormData>) => void
  handleCepBlur: () => void
  cepLoading: boolean
}

const inputClass = (hasError?: boolean) =>
  `contrato-criar-input${hasError ? ' contrato-criar-input--error' : ''}`

export function StepImovelLocalizacao({
  data,
  errors,
  patchAddress,
  handleCepBlur,
  cepLoading,
}: StepImovelLocalizacaoProps) {
  return (
    <div className="contrato-criar-step-form">
      <FormSection
        title="Endereço"
        description="Informe o CEP para preencher os campos automaticamente."
      >
        <div className="contrato-criar-form-grid">
          <EntityFormField
            label="CEP"
            htmlFor="imovel-cep"
            required
            error={errors.postal_code}
          >
            <CepInputBr
              id="imovel-cep"
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
            htmlFor="imovel-street"
            required
            error={errors.street}
            className="contrato-criar-field--wide"
          >
            <input
              id="imovel-street"
              type="text"
              className={inputClass(Boolean(errors.street))}
              value={data.address.street}
              onChange={(e) => patchAddress({ street: e.target.value })}
            />
          </EntityFormField>

          <EntityFormField
            label="Número"
            htmlFor="imovel-number"
            required
            error={errors.number}
          >
            <input
              id="imovel-number"
              type="text"
              className={inputClass(Boolean(errors.number))}
              value={data.address.number}
              onChange={(e) => patchAddress({ number: e.target.value })}
            />
          </EntityFormField>

          <EntityFormField
            label="Complemento"
            htmlFor="imovel-complement"
            error={errors.complement}
          >
            <input
              id="imovel-complement"
              type="text"
              className={inputClass(Boolean(errors.complement))}
              value={data.address.complement}
              onChange={(e) => patchAddress({ complement: e.target.value })}
              placeholder="Ex.: Bloco A, Apto 302"
            />
          </EntityFormField>

          <EntityFormField
            label="Bairro"
            htmlFor="imovel-neighborhood"
            required
            error={errors.neighborhood}
          >
            <input
              id="imovel-neighborhood"
              type="text"
              className={inputClass(Boolean(errors.neighborhood))}
              value={data.address.neighborhood}
              onChange={(e) => patchAddress({ neighborhood: e.target.value })}
            />
          </EntityFormField>

          <EntityFormField
            label="Cidade"
            htmlFor="imovel-city"
            required
            error={errors.city}
          >
            <input
              id="imovel-city"
              type="text"
              className={inputClass(Boolean(errors.city))}
              value={data.address.city}
              onChange={(e) => patchAddress({ city: e.target.value })}
            />
          </EntityFormField>

          <EntityFormField
            label="Estado"
            htmlFor="imovel-state"
            required
            error={errors.state}
          >
            <input
              id="imovel-state"
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
