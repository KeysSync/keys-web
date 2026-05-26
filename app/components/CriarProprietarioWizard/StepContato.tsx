'use client'

import { EntityFormField } from '@/app/components/EntityForm/EntityFormField'
import { FormSection } from '@/app/components/FormSection/FormSection'
import { MaskedTextInputBr } from '@/components/ui/masked-text-input-br'
import type {
  ProprietarioFormData,
  ProprietarioFormErrors,
  ProprietarioTelefone,
} from '@/lib/proprietarios/types'
import { Plus, Trash2 } from 'lucide-react'

interface StepContatoProps {
  data: ProprietarioFormData
  errors: ProprietarioFormErrors
  addTelefone: () => void
  removeTelefone: (id: string) => void
  updateTelefone: (id: string, partial: Partial<ProprietarioTelefone>) => void
}

const inputClass = (hasError?: boolean) =>
  `contrato-criar-input${hasError ? ' contrato-criar-input--error' : ''}`

export function StepContato({
  data,
  errors,
  addTelefone,
  removeTelefone,
  updateTelefone,
}: StepContatoProps) {
  return (
    <div className="contrato-criar-step-form">
      <FormSection
        title="Telefones"
        description="Adicione um ou mais números com observações internas."
      >
        <div className="entity-form-repeater">
          {data.telefones.map((tel, index) => (
            <div key={tel.id} className="entity-form-repeater__item">
              <div className="entity-form-repeater__item-head">
                <p className="entity-form-repeater__item-title">
                  Telefone {index + 1}
                </p>
                {data.telefones.length > 1 ? (
                  <button
                    type="button"
                    className="entity-form-repeater__remove"
                    onClick={() => removeTelefone(tel.id)}
                  >
                    <Trash2 size={14} aria-hidden />
                    Remover
                  </button>
                ) : null}
              </div>
              <div className="contrato-criar-form-grid">
                <EntityFormField
                  label="Número"
                  htmlFor={`tel-${tel.id}`}
                  error={errors.telefones?.[tel.id]?.number}
                >
                  <MaskedTextInputBr
                    id={`tel-${tel.id}`}
                    mask="phone"
                    className={inputClass(
                      Boolean(errors.telefones?.[tel.id]?.number),
                    )}
                    value={tel.number}
                    onChange={(v) => updateTelefone(tel.id, { number: v })}
                  />
                </EntityFormField>
                <EntityFormField
                  label="Observações"
                  htmlFor={`tel-obs-${tel.id}`}
                  className="contrato-criar-field--wide"
                >
                  <input
                    id={`tel-obs-${tel.id}`}
                    type="text"
                    className={inputClass()}
                    value={tel.obs}
                    onChange={(e) =>
                      updateTelefone(tel.id, { obs: e.target.value })
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
            onClick={addTelefone}
          >
            <Plus size={16} aria-hidden />
            Adicionar telefone
          </button>
        </div>
      </FormSection>
    </div>
  )
}
