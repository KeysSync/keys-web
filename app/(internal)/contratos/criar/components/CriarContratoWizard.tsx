'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { CONTRATO_WIZARD_DEFAULT_STEP } from '@/lib/contratos/wizard/constants'
import {
  clearContratoCriarEntry,
  getContratoWizardDraft,
  saveContratoWizardDraft,
} from '@/lib/contratos/wizard/draft'
import type { ContratoWizardStepId } from '@/lib/contratos/wizard/types'
import { ContratoStepper } from './ContratoStepper'
import { StepImovel } from './steps/StepImovel'
import { StepPlaceholder } from './steps/StepPlaceholder'

const stepTitles: Record<ContratoWizardStepId, string> = {
  imovel: 'Imóvel',
  geral: 'Geral',
  locatarios: 'Locatários',
  garantia: 'Garantia',
  seguro: 'Seguro incêndio',
  lancamentos: 'Lançamentos',
  cobranca: 'Cobrança',
  redacao: 'Redação',
}

export function CriarContratoWizard() {
  const router = useRouter()
  const [step, setStep] = useState<ContratoWizardStepId>(
    () => getContratoWizardDraft().step ?? CONTRATO_WIZARD_DEFAULT_STEP,
  )
  const [imovelId, setImovelId] = useState<string | null>(
    () => getContratoWizardDraft().imovelId,
  )

  function goToStep(next: ContratoWizardStepId) {
    setStep(next)
    saveContratoWizardDraft({ step: next })
  }

  function handleCancel() {
    clearContratoCriarEntry()
    router.push('/contratos')
  }

  function renderStep() {
    switch (step) {
      case 'imovel':
        return (
          <StepImovel
            selectedId={imovelId}
            onSelect={setImovelId}
          />
        )
      case 'geral':
        return <StepPlaceholder title={stepTitles.geral} />
      case 'locatarios':
        return <StepPlaceholder title={stepTitles.locatarios} />
      case 'garantia':
        return <StepPlaceholder title={stepTitles.garantia} />
      case 'seguro':
        return <StepPlaceholder title={stepTitles.seguro} />
      case 'lancamentos':
        return <StepPlaceholder title={stepTitles.lancamentos} />
      case 'cobranca':
        return <StepPlaceholder title={stepTitles.cobranca} />
      case 'redacao':
        return <StepPlaceholder title={stepTitles.redacao} />
      default:
        return (
          <StepImovel
            selectedId={imovelId}
            onSelect={setImovelId}
          />
        )
    }
  }

  const activeStepLabel = stepTitles[step]
  const canContinueImovel = step === 'imovel' && Boolean(imovelId)

  return (
    <div className="contrato-criar-page">
      <aside className="contrato-criar-sidebar">
        <button type="button" className="contrato-criar-back" onClick={handleCancel}>
          <ArrowLeft size={16} />
          Contratos
        </button>

        <ContratoStepper
          currentStep={step}
          onStepClick={(id) => {
            if (id === 'imovel') goToStep(id)
          }}
        />
      </aside>

      <div className="contrato-criar-main">
        <header className="contrato-criar-main__head">
          <h2 className="contrato-criar-main__step-name">{activeStepLabel}</h2>
        </header>

        <div className="contrato-criar-main__body">{renderStep()}</div>

        {step === 'imovel' && (
          <footer className="contrato-criar-footer">
            <p className="contrato-criar-footer__hint">
              {imovelId
                ? 'Imóvel selecionado. Você pode seguir para a próxima etapa.'
                : 'Selecione um imóvel da lista para continuar.'}
            </p>
            <button
              type="button"
              className="contrato-criar-footer__next"
              disabled={!canContinueImovel}
              onClick={() => goToStep('geral')}
            >
              Continuar
              <ArrowRight size={18} />
            </button>
          </footer>
        )}
      </div>
    </div>
  )
}
