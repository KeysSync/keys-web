'use client'

import { EntityFormField } from '@/app/components/EntityForm/EntityFormField'
import { FormSection } from '@/app/components/FormSection/FormSection'
import { Checkbox } from '@/app/components/Checkbox/Checkbox'
import { DocumentInputBr } from '@/components/ui/document-input-br'
import { MaskedTextInputBr } from '@/components/ui/masked-text-input-br'
import { PixKeyInputBr } from '@/components/ui/pix-key-input-br'
import { Select } from '@/components/ui/select'
import { bancoOptions } from '@/lib/mocks/bancos'
import {
  BANK_ACCOUNT_TYPE_OPTIONS,
  PIX_TYPE_OPTIONS,
} from '@/lib/proprietarios/constants'
import type {
  ProprietarioBankAccount,
  ProprietarioFormData,
  ProprietarioFormErrors,
} from '@/lib/proprietarios/types'
import { Plus, Trash2 } from 'lucide-react'

interface StepBancarioProps {
  data: ProprietarioFormData
  errors: ProprietarioFormErrors
  addBankAccount: () => void
  removeBankAccount: (id: string) => void
  updateBankAccount: (id: string, partial: Partial<ProprietarioBankAccount>) => void
}

const inputClass = (hasError?: boolean) =>
  `contrato-criar-input${hasError ? ' contrato-criar-input--error' : ''}`

export function StepBancario({
  data,
  errors,
  addBankAccount,
  removeBankAccount,
  updateBankAccount,
}: StepBancarioProps) {
  return (
    <div className="contrato-criar-step-form">
      <FormSection
        title="Contas bancárias"
        description="Opcional. Cadastre contas para repasses e pagamentos."
      >
        <div className="entity-form-repeater">
          {data.bank_account.length === 0 ? (
            <p className="contrato-criar-field__hint" style={{ margin: 0 }}>
              Nenhuma conta cadastrada.
            </p>
          ) : null}

          {data.bank_account.map((acc, index) => (
            <div key={acc.id} className="entity-form-repeater__item">
              <div className="entity-form-repeater__item-head">
                <p className="entity-form-repeater__item-title">
                  Conta {index + 1}
                </p>
                <button
                  type="button"
                  className="entity-form-repeater__remove"
                  onClick={() => removeBankAccount(acc.id)}
                >
                  <Trash2 size={14} aria-hidden />
                  Remover
                </button>
              </div>
              <div className="contrato-criar-form-grid">
                <EntityFormField
                  label="Tipo"
                  required
                  error={errors.bank_account?.[acc.id]?.type}
                >
                  <Select
                    className={errors.bank_account?.[acc.id]?.type ? 'keys-ui-select-trigger--error' : undefined}
                    placeholder="Tipo"
                    options={[
                      { value: '', label: 'Selecione' },
                      ...BANK_ACCOUNT_TYPE_OPTIONS,
                    ]}
                    value={acc.type}
                    onChange={(e) =>
                      updateBankAccount(acc.id, {
                        type: e.target.value as ProprietarioBankAccount['type'],
                      })
                    }
                  />
                </EntityFormField>

                <EntityFormField
                  label="Banco"
                  required
                  error={errors.bank_account?.[acc.id]?.bank_id}
                >
                  <Select
                    className={errors.bank_account?.[acc.id]?.bank_id ? 'keys-ui-select-trigger--error' : undefined}
                    placeholder="Banco"
                    options={[{ value: '', label: 'Selecione' }, ...bancoOptions]}
                    value={acc.bank_id}
                    onChange={(e) =>
                      updateBankAccount(acc.id, { bank_id: e.target.value })
                    }
                  />
                </EntityFormField>

                <EntityFormField label="Agência">
                  <MaskedTextInputBr
                    mask="agency"
                    value={acc.agency}
                    onChange={(v) => updateBankAccount(acc.id, { agency: v })}
                  />
                </EntityFormField>

                <EntityFormField label="Conta">
                  <MaskedTextInputBr
                    mask="bankAccount"
                    value={acc.account}
                    onChange={(v) => updateBankAccount(acc.id, { account: v })}
                  />
                </EntityFormField>

                <EntityFormField
                  label="Documento do titular"
                  required
                  error={errors.bank_account?.[acc.id]?.document}
                >
                  <DocumentInputBr
                    className={inputClass(
                      Boolean(errors.bank_account?.[acc.id]?.document),
                    )}
                    value={acc.document}
                    onChange={(v) =>
                      updateBankAccount(acc.id, { document: v })
                    }
                  />
                </EntityFormField>

                <EntityFormField
                  label="Favorecido"
                  required
                  error={errors.bank_account?.[acc.id]?.favored}
                  className="contrato-criar-field--wide"
                >
                  <input
                    type="text"
                    className={inputClass(
                      Boolean(errors.bank_account?.[acc.id]?.favored),
                    )}
                    value={acc.favored}
                    onChange={(e) =>
                      updateBankAccount(acc.id, {
                        favored: e.target.value,
                      })
                    }
                  />
                </EntityFormField>

                <EntityFormField label="Tipo PIX">
                  <Select
                    placeholder="Tipo"
                    options={[
                      { value: '', label: 'Nenhum' },
                      ...PIX_TYPE_OPTIONS,
                    ]}
                    value={acc.pix_type}
                    onChange={(e) =>
                      updateBankAccount(acc.id, {
                        pix_type: e.target.value as ProprietarioBankAccount['pix_type'],
                      })
                    }
                  />
                </EntityFormField>

                <EntityFormField label="Chave PIX">
                  <PixKeyInputBr
                    value={acc.pix_key}
                    onChange={(v) =>
                      updateBankAccount(acc.id, { pix_key: v })
                    }
                  />
                </EntityFormField>

                <EntityFormField
                  label="Conta principal"
                  className="contrato-criar-field--wide"
                >
                  <Checkbox
                    label="Usar como conta principal"
                    checked={acc.main}
                    onChange={(e) =>
                      updateBankAccount(acc.id, { main: e.target.checked })
                    }
                  />
                </EntityFormField>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="entity-form-repeater__add"
            onClick={addBankAccount}
          >
            <Plus size={16} aria-hidden />
            Adicionar conta bancária
          </button>
        </div>
      </FormSection>
    </div>
  )
}
