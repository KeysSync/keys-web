'use client'

import { EntityFormField } from '@/app/components/EntityForm/EntityFormField'
import { FormSection } from '@/app/components/FormSection/FormSection'
import { DateInputBr } from '@/components/ui/date-input-br'
import { Select } from '@/components/ui/select'
import {
  CIVIL_STATUS_OPTIONS,
  CIVIL_STATUS_WITH_PARTNER,
  MARRIAGE_REGIME_OPTIONS,
} from '@/lib/proprietarios/constants'
import { mockProprietarios } from '@/lib/mocks/proprietarios'
import type {
  ProprietarioFormData,
  ProprietarioFormErrors,
} from '@/lib/proprietarios/types'

interface StepPessoalProps {
  data: ProprietarioFormData
  errors: ProprietarioFormErrors
  patch: (partial: Partial<ProprietarioFormData>) => void
}

const inputClass = (hasError?: boolean) =>
  `contrato-criar-input${hasError ? ' contrato-criar-input--error' : ''}`

const partnerOptions = [
  { value: '', label: 'Nenhum' },
  ...mockProprietarios
    .filter((p) => p.tipo === 'pf')
    .map((p) => ({ value: p.id, label: p.nome })),
]

export function StepPessoal({ data, errors, patch }: StepPessoalProps) {
  const isPerson = data.type === 'person'
  const showMarriageFields =
    isPerson && data.civil_status && CIVIL_STATUS_WITH_PARTNER.has(data.civil_status)

  if (!isPerson) {
    return (
      <div className="contrato-criar-step-form">
        <div className="contrato-criar-step-placeholder">
          <p className="contrato-criar-step-placeholder__label">
            Pessoa jurídica
          </p>
          <p className="contrato-criar-step-placeholder__desc">
            Os dados pessoais se aplicam apenas a pessoas físicas. Prossiga
            para a próxima etapa.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="contrato-criar-step-form">
      <FormSection title="Documentação" description="RG e órgão emissor.">
        <div className="contrato-criar-form-grid">
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
        <div className="contrato-criar-form-grid">
          <EntityFormField
            label="Data de nascimento"
            htmlFor="proprietario-birthdate"
            required
            error={errors.birthdate}
            className="contrato-criar-field--date"
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
                        .value as ProprietarioFormData['marriage_regime'],
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
