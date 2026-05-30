'use client'

import { EntityFormField } from '@/app/components/EntityForm/EntityFormField'
import { FormSection } from '@/app/components/FormSection/FormSection'
import { DateInputBr } from '@/components/ui/date-input-br'
import { Select } from '@/components/ui/select'
import {
  CIVIL_STATUS_OPTIONS,
  CIVIL_STATUS_WITH_PARTNER,
  MARRIAGE_REGIME_OPTIONS,
} from '@/lib/owners/constants'
import type {
  OwnerFormData,
  OwnerFormErrors,
} from '@/lib/owners/types'

interface StepPersonalProps {
  data: OwnerFormData
  errors: OwnerFormErrors
  patch: (partial: Partial<OwnerFormData>) => void
}

const inputClass = (hasError?: boolean) =>
  `contract-create-input${hasError ? ' contract-create-input--error' : ''}`

const partnerOptions = [{ value: '', label: 'Nenhum' }]

export function StepPersonal({ data, errors, patch }: StepPersonalProps) {
  const isPerson = data.type === 'person'
  const showMarriageFields =
    isPerson && data.civil_status && CIVIL_STATUS_WITH_PARTNER.has(data.civil_status)

  if (!isPerson) {
    return (
      <div className="contract-create-step-form">
        <div className="contract-create-step-placeholder">
          <p className="contract-create-step-placeholder__label">
            Pessoa jurídica
          </p>
          <p className="contract-create-step-placeholder__desc">
            Os dados pessoais se aplicam apenas a pessoas físicas. Prossiga
            para a próxima etapa.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="contract-create-step-form">
      <FormSection title="Documentação" description="RG e órgão emissor.">
        <div className="contract-create-form-grid">
          <EntityFormField label="RG" htmlFor="proprietario-rg">
            <input
              id="proprietario-rg"
              type="text"
              className={inputClass()}
              value={data.rg}
              onChange={(e) => patch({ rg: e.target.value })}
            />
          </EntityFormField>
          <EntityFormField label="Órgão emissor" htmlFor="proprietario-rg-origin">
            <input
              id="proprietario-rg-origin"
              type="text"
              className={inputClass()}
              value={data.rg_origin}
              onChange={(e) => patch({ rg_origin: e.target.value })}
              placeholder="Ex.: SSP/SP"
            />
          </EntityFormField>
        </div>
      </FormSection>

      <FormSection
        title="Dados pessoais"
        description="Data de nascimento, nacionalidade e estado civil."
      >
        <div className="contract-create-form-grid">
          <EntityFormField
            label="Data de nascimento"
            htmlFor="proprietario-birthdate"
            required
            error={errors.birthdate}
            className="contract-create-field--date"
          >
            <DateInputBr
              id="proprietario-birthdate"
              className={errors.birthdate ? 'date-input-br--error' : undefined}
              value={data.birthdate}
              onChange={(iso) => patch({ birthdate: iso })}
            />
          </EntityFormField>

          <EntityFormField label="Profissão" htmlFor="proprietario-occupation">
            <input
              id="proprietario-occupation"
              type="text"
              className={inputClass()}
              value={data.occupation}
              onChange={(e) => patch({ occupation: e.target.value })}
            />
          </EntityFormField>

          <EntityFormField label="Nacionalidade" htmlFor="proprietario-nationality">
            <input
              id="proprietario-nationality"
              type="text"
              className={inputClass()}
              value={data.nationality}
              onChange={(e) => patch({ nationality: e.target.value })}
            />
          </EntityFormField>

          <EntityFormField label="Naturalidade" htmlFor="proprietario-place-of-birth">
            <input
              id="proprietario-place-of-birth"
              type="text"
              className={inputClass()}
              value={data.place_of_birth}
              onChange={(e) => patch({ place_of_birth: e.target.value })}
            />
          </EntityFormField>

          <EntityFormField label="Estado civil" htmlFor="proprietario-civil-status">
            <Select
              id="proprietario-civil-status"
              placeholder="Selecione"
              options={[
                { value: '', label: 'Selecione' },
                ...CIVIL_STATUS_OPTIONS,
              ]}
              value={data.civil_status}
              onChange={(e) => {
                const civil_status = e.target.value
                patch({
                  civil_status,
                  marriage_regime: CIVIL_STATUS_WITH_PARTNER.has(civil_status)
                    ? data.marriage_regime
                    : '',
                  partner: CIVIL_STATUS_WITH_PARTNER.has(civil_status)
                    ? data.partner
                    : '',
                })
              }}
            />
          </EntityFormField>

          {showMarriageFields ? (
            <>
              <EntityFormField
                label="Regime de casamento"
                htmlFor="proprietario-marriage-regime"
                required
                error={errors.marriage_regime}
              >
                <Select
                  id="proprietario-marriage-regime"
                  className={errors.marriage_regime ? 'keys-ui-select-trigger--error' : undefined}
                  placeholder="Selecione"
                  options={[
                    { value: '', label: 'Selecione' },
                    ...MARRIAGE_REGIME_OPTIONS,
                  ]}
                  value={data.marriage_regime}
                  onChange={(e) =>
                    patch({
                      marriage_regime: e.target
                        .value as OwnerFormData['marriage_regime'],
                    })
                  }
                />
              </EntityFormField>
              <EntityFormField label="Cônjuge" htmlFor="proprietario-partner">
                <Select
                  id="proprietario-partner"
                  placeholder="Vincular pessoa"
                  options={partnerOptions}
                  value={data.partner}
                  onChange={(e) => patch({ partner: e.target.value })}
                />
              </EntityFormField>
            </>
          ) : null}
        </div>
      </FormSection>
    </div>
  )
}
