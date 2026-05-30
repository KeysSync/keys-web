'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { CONTRACT_WIZARD_DEFAULT_STEP, CONTRACT_WIZARD_STEPS } from '@/lib/contracts/wizard/constants'
import {
  clearContractCreateEntry,
  getContractDraftPendingSteps,
  getContractWizardDraft,
  saveContractWizardDraft,
} from '@/lib/contracts/wizard/draft'
import type { ContractPropertySummary } from '@/lib/contracts/property-summary'
import type { TenantListRow } from '@/lib/tenants/api'
import type { ContractWizardStepId } from '@/lib/contracts/wizard/types'
import { ContractStepper } from '@/app/components/ContractStepper/ContractStepper'
import { WizardStepFooter } from '@/app/components/WizardStepFooter/WizardStepFooter'
import { StepBilling } from '@/app/components/StepBilling/StepBilling'
import { StepGuarantee } from '@/app/components/StepGuarantee/StepGuarantee'
import { StepGeneral } from '@/app/components/StepGeneral/StepGeneral'
import { StepProperty } from '@/app/components/StepProperty/StepProperty'
import { StepEntries } from '@/app/components/StepEntries/StepEntries'
import { StepTenants } from '@/app/components/StepTenants/StepTenants'
import { StepDrafting } from '@/app/components/StepDrafting/StepDrafting'
import { StepInsurance } from '@/app/components/StepInsurance/StepInsurance'

const STEP_HINTS: Record<ContractWizardStepId, string> = {
  property: 'Selecione o imóvel vinculado ao contrato.',
  general: 'Preencha vigência, valores e condições gerais.',
  tenants: 'Vincule inquilinos e defina o papel de cada um.',
  guarantee: 'Configure fiador, caução ou outro tipo de garantia.',
  insurance: 'Modalidades de seguro vinculadas ao contrato (incêndio, fiança, RC, etc.).',
  entries: 'Monte os lançamentos recorrentes e avulsos do contrato.',
  billing: 'Defina vencimento, forma de pagamento e repasse.',
  drafting: 'Revise o modelo e finalize o cadastro do contrato.',
}

type CreateContractWizardProps = {
  properties: ContractPropertySummary[]
  tenants: TenantListRow[]
}

export function CreateContractWizard({
  properties,
  tenants,
}: CreateContractWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState<ContractWizardStepId>(
    () => getContractWizardDraft().step ?? CONTRACT_WIZARD_DEFAULT_STEP,
  )
  const [propertyId, setPropertyId] = useState<string | null>(
    () => getContractWizardDraft().propertyId,
  )

  const stepIndex = CONTRACT_WIZARD_STEPS.findIndex((s) => s.id === step)

  function goToStep(next: ContractWizardStepId) {
    setStep(next)
    saveContractWizardDraft({ step: next })
  }

  function handleCancel() {
    clearContractCreateEntry()
    router.push('/locacao/contratos')
  }

  function handleFinish() {
    const pending = getContractDraftPendingSteps(getContractWizardDraft())
    if (pending.length > 0) {
      goToStep(pending[0].id)
      return
    }
    clearContractCreateEntry()
    router.push('/locacao/contratos')
  }

  const footerConfig = useMemo(() => {
    const prev = stepIndex > 0 ? CONTRACT_WIZARD_STEPS[stepIndex - 1].id : null
    const next =
      stepIndex < CONTRACT_WIZARD_STEPS.length - 1
        ? CONTRACT_WIZARD_STEPS[stepIndex + 1].id
        : null

    if (step === 'drafting') {
      return {
        hint: STEP_HINTS.drafting,
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
      case 'property':
        return (
          <StepProperty
            properties={properties}
            selectedId={propertyId}
            onSelect={setPropertyId}
          />
        )
      case 'general':
        return <StepGeneral propertyId={propertyId} properties={properties} />
      case 'tenants':
        return <StepTenants tenants={tenants} />
      case 'guarantee':
        return <StepGuarantee />
      case 'insurance':
        return <StepInsurance />
      case 'entries':
        return <StepEntries />
      case 'billing':
        return <StepBilling />
      case 'drafting':
        return <StepDrafting properties={properties} tenants={tenants} />
      default:
        return (
          <StepProperty
            properties={properties}
            selectedId={propertyId}
            onSelect={setPropertyId}
          />
        )
    }
  }

  return (
    <div className="contract-create-page">
      <aside className="contract-create-sidebar">
        <button type="button" className="contract-create-back" onClick={handleCancel}>
          <ArrowLeft size={16} />
          Contratos
        </button>

        <ContractStepper currentStep={step} onStepClick={goToStep} />
      </aside>

      <div className="contract-create-main">
        <div className="contract-create-main__body">{renderStep()}</div>

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
