'use client'

import { EntityFormField } from '@/app/components/EntityForm/EntityFormField'
import { FormSection } from '@/app/components/FormSection/FormSection'
import { MaskedTextInputBr } from '@/components/ui/masked-text-input-br'
import type {
  OwnerFormData,
  OwnerFormErrors,
  OwnerPhone,
} from '@/lib/owners/types'
import { Plus, Trash2 } from 'lucide-react'

interface StepContactProps {
  data: OwnerFormData
  errors: OwnerFormErrors
  addPhone: () => void
  removePhone: (id: string) => void
  updatePhone: (id: string, partial: Partial<OwnerPhone>) => void
}

const inputClass = (hasError?: boolean) =>
  `contract-create-input${hasError ? ' contract-create-input--error' : ''}`

export function StepContact({
  data,
  errors,
  addPhone,
  removePhone,
  updatePhone,
}: StepContactProps) {
  return (
    <div className="contract-create-step-form">
      <FormSection
        title="Telefones"
        description="Adicione um ou mais números com observações internas."
      >
        <div className="entity-form-repeater">
          {data.phones.map((tel, index) => (
            <div key={tel.id} className="entity-form-repeater__item">
              <div className="entity-form-repeater__item-head">
                <p className="entity-form-repeater__item-title">
                  Telefone {index + 1}
                </p>
                {data.phones.length > 1 ? (
                  <button
                    type="button"
                    className="entity-form-repeater__remove"
                    onClick={() => removePhone(tel.id)}
                  >
                    <Trash2 size={14} aria-hidden />
                    Remover
                  </button>
                ) : null}
              </div>
              <div className="contract-create-form-grid">
                <EntityFormField
                  label="Número"
                  htmlFor={`tel-${tel.id}`}
                  error={errors.phones?.[tel.id]?.number}
                >
                  <MaskedTextInputBr
                    id={`tel-${tel.id}`}
                    mask="phone"
                    className={inputClass(
                      Boolean(errors.phones?.[tel.id]?.number),
                    )}
                    value={tel.number}
                    onChange={(v) => updatePhone(tel.id, { number: v })}
                  />
                </EntityFormField>
                <EntityFormField
                  label="Observações"
                  htmlFor={`tel-obs-${tel.id}`}
                  className="contract-create-field--wide"
                >
                  <input
                    id={`tel-obs-${tel.id}`}
                    type="text"
                    className={inputClass()}
                    value={tel.obs}
                    onChange={(e) =>
                      updatePhone(tel.id, { obs: e.target.value })
                    }
                    placeholder="Ex.: WhatsApp preferencial"
                  />
                </EntityFormField>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="entity-form-repeater__add"
            onClick={addPhone}
          >
            <Plus size={16} aria-hidden />
            Adicionar telefone
          </button>
        </div>
      </FormSection>
    </div>
  )
}
