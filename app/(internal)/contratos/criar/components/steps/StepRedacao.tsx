'use client'

import { useMemo, useState } from 'react'
import { FileText } from 'lucide-react'
import { getContratoWizardDraft, patchContratoRedacaoData } from '@/lib/contratos/wizard/draft'
import {
  CONTRATO_MODELO_OPTIONS,
  defaultContratoRedacaoData,
  type ContratoRedacaoData,
} from '@/lib/contratos/wizard/redacao'
import { mockImoveis } from '@/lib/mocks/imoveis'
import { mockInquilinos } from '@/lib/mocks/inquilinos'
import { ContratoSelect } from '../ContratoSelect'
import { FormField } from './geral/FormField'
import { FormSection } from './geral/FormSection'

const MODELO_OPTIONS = CONTRATO_MODELO_OPTIONS.map((opt) => ({
  value: opt.id,
  label: opt.label,
}))

export function StepRedacao() {
  const [data, setData] = useState<ContratoRedacaoData>(() => {
    const draft = getContratoWizardDraft()
    return { ...defaultContratoRedacaoData(), ...draft.redacao }
  })

  function patch(partial: Partial<ContratoRedacaoData>) {
    setData((prev) => {
      const next = { ...prev, ...partial }
      patchContratoRedacaoData(next)
      return next
    })
  }

  const resumo = useMemo(() => {
    const draft = getContratoWizardDraft()
    const imovel = mockImoveis.find((i) => i.id === draft.imovelId)
    const principal = draft.locatarios.vinculos.find((v) => v.papel === 'principal')
    const inquilino = mockInquilinos.find((i) => i.id === principal?.inquilinoId)
    const modelo = CONTRATO_MODELO_OPTIONS.find((m) => m.id === data.modeloId)

    return {
      imovel: imovel?.titulo ?? '—',
      locatario: inquilino?.nome ?? '—',
      modelo: modelo?.label ?? '—',
      inicio: draft.geral.inicioContrato
        ? new Date(draft.geral.inicioContrato + 'T12:00:00').toLocaleDateString('pt-BR')
        : '—',
      valor:
        typeof draft.geral.valorAluguel === 'number'
          ? draft.geral.valorAluguel.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })
          : '—',
    }
  }, [data.modeloId])

  return (
    <div className="contrato-criar-step-form">
      <FormSection
        title="Modelo e redação"
        description="Escolha o modelo base e complemente com cláusulas específicas."
      >
        <div className="contrato-criar-form-grid">
          <FormField label="Modelo de contrato" htmlFor="modelo" className="contrato-criar-field--wide">
            <ContratoSelect
              id="modelo"
              value={data.modeloId}
              options={MODELO_OPTIONS}
              onChange={(v) => patch({ modeloId: v })}
            />
          </FormField>
        </div>

        <FormField label="Cláusulas adicionais" htmlFor="clausulas">
          <textarea
            id="clausulas"
            className="contrato-criar-textarea contrato-criar-textarea--tall"
            rows={6}
            value={data.clausulasAdicionais}
            onChange={(e) => patch({ clausulasAdicionais: e.target.value })}
            placeholder="Texto livre para cláusulas especiais acordadas entre as partes…"
          />
        </FormField>

        <div className="contrato-criar-checklist">
          <label className="contrato-criar-check">
            <input
              type="checkbox"
              checked={data.incluirAnexoVistoria}
              onChange={(e) => patch({ incluirAnexoVistoria: e.target.checked })}
            />
            Incluir anexo de vistoria de entrada
          </label>
          <label className="contrato-criar-check">
            <input
              type="checkbox"
              checked={data.incluirAnexoRegulamento}
              onChange={(e) => patch({ incluirAnexoRegulamento: e.target.checked })}
            />
            Incluir regulamento interno / convenção
          </label>
        </div>
      </FormSection>

      <FormSection title="Resumo para conferência">
        <div className="contrato-criar-redacao-resumo">
          <FileText size={20} aria-hidden />
          <dl>
            <div>
              <dt>Imóvel</dt>
              <dd>{resumo.imovel}</dd>
            </div>
            <div>
              <dt>Locatário principal</dt>
              <dd>{resumo.locatario}</dd>
            </div>
            <div>
              <dt>Início</dt>
              <dd>{resumo.inicio}</dd>
            </div>
            <div>
              <dt>Aluguel</dt>
              <dd>{resumo.valor}</dd>
            </div>
            <div>
              <dt>Modelo</dt>
              <dd>{resumo.modelo}</dd>
            </div>
          </dl>
        </div>
      </FormSection>

      <FormSection title="Observações internas">
        <FormField label="Uso da imobiliária (não impresso no contrato)" htmlFor="obs-interna">
          <textarea
            id="obs-interna"
            className="contrato-criar-textarea"
            rows={3}
            value={data.observacoesInternas}
            onChange={(e) => patch({ observacoesInternas: e.target.value })}
          />
        </FormField>
      </FormSection>
    </div>
  )
}
