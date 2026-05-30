'use client'

import { useState } from 'react'
import { getContractWizardDraft, patchContractBillingData } from '@/lib/contracts/wizard/draft'
import {
  defaultContractBillingData,
  PAYMENT_METHOD_OPTIONS,
  type ContractBillingData,
  type PaymentMethod,
} from '@/lib/contracts/wizard/billing'
import { DayInputBr } from '@/components/ui/day-input-br'
import { MaskedTextInputBr } from '@/components/ui/masked-text-input-br'
import { PixKeyInputBr } from '@/components/ui/pix-key-input-br'
import { ContractSelect } from '@/app/components/ContractSelect/ContractSelect'
import { FormField } from '@/app/components/FormField/FormField'
import { FormSection } from '@/app/components/FormSection/FormSection'

const inputClass = 'contract-create-input'

export function StepBilling() {
  const [data, setData] = useState<ContractBillingData>(() => {
    const draft = getContractWizardDraft()
    return { ...defaultContractBillingData(), ...draft.billing }
  })

  function patch(partial: Partial<ContractBillingData>) {
    setData((prev) => {
      const next = { ...prev, ...partial }
      patchContractBillingData(next)
      return next
    })
  }

  const showPix = data.paymentMethod === 'pix'

  return (
    <div className="contract-create-step-form">
      <FormSection
        title="Cobrança"
        description="Como o locatário será cobrado e para onde o repasse será direcionado."
      >
        <div className="contract-create-form-row">
          <FormField
            label="Dia de vencimento"
            htmlFor="dia-vencimento"
            className="contract-create-field--day"
          >
            <DayInputBr
              id="dia-vencimento"
              value={data.dueDay}
              onChange={(v) => patch({ dueDay: v })}
            />
          </FormField>

          <FormField
            label="Forma de recebimento"
            htmlFor="forma-recebimento"
            className="contract-create-field--grow"
          >
            <ContractSelect
              id="forma-recebimento"
              value={data.paymentMethod}
              options={PAYMENT_METHOD_OPTIONS}
              onChange={(v) => patch({ paymentMethod: v as PaymentMethod })}
            />
          </FormField>
        </div>

        <div className="contract-create-checklist">
          <label className="contract-create-check">
            <input
              type="checkbox"
              checked={data.sendInvoiceEmail}
              onChange={(e) => patch({ sendInvoiceEmail: e.target.checked })}
            />
            Enviar boleto por e-mail automaticamente
          </label>
          <label className="contract-create-check">
            <input
              type="checkbox"
              checked={data.sendDueReminder}
              onChange={(e) => patch({ sendDueReminder: e.target.checked })}
            />
            Lembrete antes do vencimento
          </label>
          <label className="contract-create-check">
            <input
              type="checkbox"
              checked={data.groupMonthlyCharges}
              onChange={(e) => patch({ groupMonthlyCharges: e.target.checked })}
            />
            Agrupar lançamentos do mês em uma única cobrança
          </label>
        </div>
      </FormSection>

      <FormSection title="Dados bancários / repasse">
        <div className="contract-create-form-row">
          <FormField
            label="Banco"
            htmlFor="banco"
            className="contract-create-field--grow"
          >
            <input
              id="banco"
              type="text"
              className={inputClass}
              value={data.banco}
              onChange={(e) => patch({ banco: e.target.value })}
            />
          </FormField>

          <FormField label="Agência" htmlFor="agencia">
            <MaskedTextInputBr
              id="agencia"
              mask="agency"
              value={data.agencia}
              onChange={(v) => patch({ agencia: v })}
            />
          </FormField>

          <FormField label="Conta" htmlFor="conta">
            <MaskedTextInputBr
              id="conta"
              mask="bankAccount"
              value={data.conta}
              onChange={(v) => patch({ conta: v })}
            />
          </FormField>
        </div>

        {showPix ? (
          <div className="contract-create-form-row">
            <FormField
              label="Chave PIX"
              htmlFor="pix"
              className="contract-create-field--full"
            >
              <PixKeyInputBr
                id="pix"
                value={data.pixKey}
                onChange={(v) => patch({ pixKey: v })}
              />
            </FormField>
          </div>
        ) : null}
      </FormSection>

      <FormSection title="Observações">
        <FormField label="Instruções de cobrança" htmlFor="cobranca-obs">
          <textarea
            id="cobranca-obs"
            className="contract-create-textarea"
            rows={3}
            value={data.notes}
            onChange={(e) => patch({ notes: e.target.value })}
          />
        </FormField>
      </FormSection>
    </div>
  )
}
