'use client'

import { useState } from 'react'
import { getContratoWizardDraft, patchContratoGarantiaData } from '@/lib/contratos/wizard/draft'
import {
  defaultContratoGarantiaData,
  TIPO_GARANTIA_OPTIONS,
  type ContratoGarantiaData,
  type TipoGarantia,
} from '@/lib/contratos/wizard/garantia'
import { CurrencyInputBr } from '@/components/ui/currency-input-br'
import { DocumentInputBr } from '@/components/ui/document-input-br'
import { ContratoSelect } from '../ContratoSelect'
import { FormDateRange } from './geral/FormDateRange'
import { FormField } from './geral/FormField'
import { FormSection } from './geral/FormSection'

const inputClass = 'contrato-criar-input'

export function StepGarantia() {
  const [data, setData] = useState<ContratoGarantiaData>(() => {
    const draft = getContratoWizardDraft()
    return { ...defaultContratoGarantiaData(), ...draft.garantia }
  })

  function patch(partial: Partial<ContratoGarantiaData>) {
    setData((prev) => {
      const next = { ...prev, ...partial }
      patchContratoGarantiaData(next)
      return next
    })
  }

  const showFiador = data.tipo === 'fiador'
  const showValor =
    data.tipo !== 'sem_garantia' && data.tipo !== 'fiador'

  return (
    <div className="contrato-criar-step-form">
      <FormSection
        title="Garantia locatícia"
        description="Defina o tipo de garantia exigida neste contrato."
      >
        <div className="contrato-criar-form-grid">
          <FormField label="Tipo de garantia" htmlFor="tipo-garantia" className="contrato-criar-field--wide">
            <ContratoSelect
              id="tipo-garantia"
              value={data.tipo}
              options={TIPO_GARANTIA_OPTIONS}
              onChange={(v) => patch({ tipo: v as TipoGarantia })}
            />
          </FormField>

          <div className="contrato-criar-form-row-split">
            {showValor ? (
              <FormField
                label="Valor da garantia (R$)"
                htmlFor="valor-garantia"
                className="contrato-criar-field--currency"
              >
                <CurrencyInputBr
                  id="valor-garantia"
                  value={data.valor}
                  onChange={(v) => patch({ valor: v })}
                />
              </FormField>
            ) : null}

            <FormDateRange
              startLabel="Vigência — início"
              endLabel="Vigência — fim"
              startId="garantia-inicio"
              endId="garantia-fim"
              startValue={data.vigenciaInicio}
              endValue={data.vigenciaFim}
              onStartChange={(iso) => patch({ vigenciaInicio: iso })}
              onEndChange={(iso) => patch({ vigenciaFim: iso })}
            />
          </div>
        </div>
      </FormSection>

      {showFiador ? (
        <FormSection title="Dados do fiador">
          <div className="contrato-criar-form-grid">
            <FormField label="Nome do fiador" htmlFor="fiador-nome">
              <input
                id="fiador-nome"
                type="text"
                className={inputClass}
                value={data.fiadorNome}
                onChange={(e) => patch({ fiadorNome: e.target.value })}
              />
            </FormField>
            <FormField label="CPF/CNPJ" htmlFor="fiador-doc">
              <DocumentInputBr
                id="fiador-doc"
                value={data.fiadorDocumento}
                onChange={(v) => patch({ fiadorDocumento: v })}
              />
            </FormField>
          </div>
        </FormSection>
      ) : null}

      <FormSection title="Observações">
        <FormField label="Anotações sobre a garantia" htmlFor="garantia-obs">
          <textarea
            id="garantia-obs"
            className="contrato-criar-textarea"
            rows={3}
            value={data.observacoes}
            onChange={(e) => patch({ observacoes: e.target.value })}
            placeholder="Ex.: prazo para apresentação da apólice, documentos exigidos…"
          />
        </FormField>
      </FormSection>
    </div>
  )
}
