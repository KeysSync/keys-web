'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { CONTRATO_WIZARD_DEFAULT_STEP, CONTRATO_WIZARD_STEPS } from '@/lib/contratos/wizard/constants'
import {
  clearContratoCriarEntry,
  getContratoDraftPendingSteps,
  getContratoWizardDraft,
  saveContratoWizardDraft,
} from '@/lib/contratos/wizard/draft'
import type { ContratoWizardStepId } from '@/lib/contratos/wizard/types'
import { ContratoStepper } from '@/app/components/ContratoStepper/ContratoStepper'
import { WizardStepFooter } from '@/app/components/WizardStepFooter/WizardStepFooter'
import { StepCobranca } from '@/app/components/StepCobranca/StepCobranca'
import { StepGarantia } from '@/app/components/StepGarantia/StepGarantia'
import { StepGeral } from '@/app/components/StepGeral/StepGeral'
import { StepImovel } from '@/app/components/StepImovel/StepImovel'
import { StepLancamentos } from '@/app/components/StepLancamentos/StepLancamentos'
import { StepLocatarios } from '@/app/components/StepLocatarios/StepLocatarios'
import { StepRedacao } from '@/app/components/StepRedacao/StepRedacao'
import { StepSeguro } from '@/app/components/StepSeguro/StepSeguro'

const STEP_HINTS: Record<ContratoWizardStepId, string> = {
  imovel: 'Selecione o imóvel vinculado ao contrato.',
  geral: 'Preencha vigência, valores e condições gerais.',
  locatarios: 'Vincule inquilinos e defina o papel de cada um.',
  garantia: 'Configure fiador, caução ou outro tipo de garantia.',
  seguro: 'Modalidades de seguro vinculadas ao contrato (incêndio, fiança, RC, etc.).',
  lancamentos: 'Monte os lançamentos recorrentes e avulsos do contrato.',
  cobranca: 'Defina vencimento, forma de pagamento e repasse.',
  redacao: 'Revise o modelo e finalize o cadastro do contrato.',
}

export function CriarContratoWizard() {
  const router = useRouter()
  const [step, setStep] = useState<ContratoWizardStepId>(
    () => getContratoWizardDraft().step ?? CONTRATO_WIZARD_DEFAULT_STEP,
  )
  const [imovelId, setImovelId] = useState<string | null>(
    () => getContratoWizardDraft().imovelId,
  )

  const stepIndex = CONTRATO_WIZARD_STEPS.findIndex((s) => s.id === step)

  function goToStep(next: ContratoWizardStepId) {
    setStep(next)
    saveContratoWizardDraft({ step: next })
  }

  function handleCancel() {
    clearContratoCriarEntry()
    router.push('/locacao/contratos')
  }

  function handleFinish() {
    const pending = getContratoDraftPendingSteps(getContratoWizardDraft())
    if (pending.length > 0) {
      goToStep(pending[0].id)
      return
    }
    clearContratoCriarEntry()
    router.push('/locacao/contratos')
  }

  const footerConfig = useMemo(() => {
    const prev = stepIndex > 0 ? CONTRATO_WIZARD_STEPS[stepIndex - 1].id : null
    const next =
      stepIndex < CONTRATO_WIZARD_STEPS.length - 1
        ? CONTRATO_WIZARD_STEPS[stepIndex + 1].id
        : null

    if (step === 'redacao') {
      return {
        hint: STEP_HINTS.redacao,
        onBack: prev ? () => goToStep(prev) : undefined,
        onNext: handleFinish,
        nextLabel: 'Concluir cadastro',
        nextDisabled: false,
      }
    }

    return {
      hint: STEP_HINTS[step],
      onBack: prev ? () => goToStep(prev) : undefined,
      onNext: next ? () => goToStep(next) : undefined,
      nextLabel: 'Continuar',
      nextDisabled: false,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, stepIndex])

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
        return <StepGeral imovelId={imovelId} />
      case 'locatarios':
        return <StepLocatarios />
      case 'garantia':
        return <StepGarantia />
      case 'seguro':
        return <StepSeguro />
      case 'lancamentos':
        return <StepLancamentos />
      case 'cobranca':
        return <StepCobranca />
      case 'redacao':
        return <StepRedacao />
      default:
        return (
          <StepImovel
            selectedId={imovelId}
            onSelect={setImovelId}
          />
        )
    }
  }

  return (
    <div className="contrato-criar-page">
      <aside className="contrato-criar-sidebar">
        <button type="button" className="contrato-criar-back" onClick={handleCancel}>
          <ArrowLeft size={16} />
          Contratos
        </button>

        <ContratoStepper currentStep={step} onStepClick={goToStep} />
      </aside>

      <div className="contrato-criar-main">
        <div className="contrato-criar-main__body">{renderStep()}</div>

        <WizardStepFooter
          hint={footerConfig.hint}
          onBack={footerConfig.onBack}
          onNext={footerConfig.onNext}
          nextLabel={footerConfig.nextLabel}
          nextDisabled={footerConfig.nextDisabled}
        />
      </div>
    </div>
  )
}
