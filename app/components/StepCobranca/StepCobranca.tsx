'use client'

import { useState } from 'react'
import { getContratoWizardDraft, patchContratoCobrancaData } from '@/lib/contratos/wizard/draft'
import {
  defaultContratoCobrancaData,
  FORMA_RECEBIMENTO_OPTIONS,
  type ContratoCobrancaData,
  type FormaRecebimento,
} from '@/lib/contratos/wizard/cobranca'
import { DayInputBr } from '@/components/ui/day-input-br'
import { MaskedTextInputBr } from '@/components/ui/masked-text-input-br'
import { PixKeyInputBr } from '@/components/ui/pix-key-input-br'
import { ContratoSelect } from '@/app/components/ContratoSelect/ContratoSelect'
import { FormField } from '@/app/components/FormField/FormField'
import { FormSection } from '@/app/components/FormSection/FormSection'

const inputClass = 'contrato-criar-input'

export function StepCobranca() {
  const [data, setData] = useState<ContratoCobrancaData>(() => {
    const draft = getContratoWizardDraft()
    return { ...defaultContratoCobrancaData(), ...draft.cobranca }
  })

  function patch(partial: Partial<ContratoCobrancaData>) {
    setData((prev) => {
      const next = { ...prev, ...partial }
      patchContratoCobrancaData(next)
      return next
    })
  }

  const showPix = data.formaRecebimento === 'pix'

  return (
    <div className="contrato-criar-step-form">
      <FormSection
        title="Cobrança"
        description="Como o locatário será cobrado e para onde o repasse será direcionado."
      >
        <div className="contrato-criar-form-grid">
          <FormField label="Dia de vencimento" htmlFor="dia-vencimento">
            <DayInputBr
              id="dia-vencimento"
              value={data.diaVencimento}
              onChange={(v) => patch({ diaVencimento: v })}
            />
          </FormField>

          <FormField label="Forma de recebimento" htmlFor="forma-recebimento">
            <ContratoSelect
              id="forma-recebimento"
              value={data.formaRecebimento}
              options={FORMA_RECEBIMENTO_OPTIONS}
              onChange={(v) => patch({ formaRecebimento: v as FormaRecebimento })}
            />
          </FormField>
        </div>

        <div className="contrato-criar-checklist">
          <label className="contrato-criar-check">
            <input
              type="checkbox"
              checked={data.enviarBoletoEmail}
              onChange={(e) => patch({ enviarBoletoEmail: e.target.checked })}
            />
            Enviar boleto por e-mail automaticamente
          </label>
          <label className="contrato-criar-check">
            <input
              type="checkbox"
              checked={data.enviarLembreteVencimento}
              onChange={(e) => patch({ enviarLembreteVencimento: e.target.checked })}
            />
            Lembrete antes do vencimento
          </label>
          <label className="contrato-criar-check">
            <input
              type="checkbox"
              checked={data.agruparCobrancasMes}
              onChange={(e) => patch({ agruparCobrancasMes: e.target.checked })}
            />
            Agrupar lançamentos do mês em uma única cobrança
          </label>
        </div>
      </FormSection>

      <FormSection title="Dados bancários / repasse">
        <div className="contrato-criar-form-grid">
          <FormField label="Banco" htmlFor="banco">
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

          {showPix ? (
            <FormField label="Chave PIX" htmlFor="pix" className="contrato-criar-field--wide">
              <PixKeyInputBr
                id="pix"
                value={data.pixChave}
                onChange={(v) => patch({ pixChave: v })}
              />
            </FormField>
          ) : null}
        </div>
      </FormSection>

      <FormSection title="Observações">
        <FormField label="Instruções de cobrança" htmlFor="cobranca-obs">
          <textarea
            id="cobranca-obs"
            className="contrato-criar-textarea"
            rows={3}
            value={data.observacoes}
            onChange={(e) => patch({ observacoes: e.target.value })}
          />
        </FormField>
      </FormSection>
    </div>
  )
}
