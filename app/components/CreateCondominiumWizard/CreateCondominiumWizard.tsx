'use client'

import {
  defaultCondominiumFormData,
  hasCondominiumFormErrors,
  validateCondominiumForm,
} from '@/lib/condominiums/form'
import type {
  CondominiumAddressFormData,
  CondominiumFormData,
  CondominiumFormErrors,
} from '@/lib/condominiums/types'
import {
  createCondominiumAction,
  updateCondominiumAction,
} from '@/lib/condominiums/actions'
import {
  CONDOMINIUM_STEP_HINTS,
  CONDOMINIUM_WIZARD_DEFAULT_STEP,
  CONDOMINIUM_WIZARD_STEPS,
  condominiumStepHasErrors,
  firstCondominiumStepWithErrors,
} from '@/lib/condominiums/wizard/constants'
import {
  clearCondominiumWizardDraft,
  getCondominiumWizardDraft,
  saveCondominiumWizardDraft,
} from '@/lib/condominiums/wizard/draft'
import type { CondominiumWizardStepId } from '@/lib/condominiums/wizard/types'
import { fetchAddressByCep } from '@/lib/utils/cep/fetch-viacep'
import { onlyDigits } from '@/lib/utils/validation'
import { useToast } from '@/lib/toast/use-toast'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { WizardStepper } from '@/app/components/WizardStepper/WizardStepper'
import { WizardStepFooter } from '@/app/components/WizardStepFooter/WizardStepFooter'
import { StepCondominiumIdentification } from './StepCondominiumIdentification'
import { StepCondominiumAddress } from './StepCondominiumAddress'

export interface CondominiumWizardProps {
  mode?: 'create' | 'edit'
  initialData?: CondominiumFormData
  condominiumId?: string
}

export function CreateCondominiumWizard({
  mode = 'create',
  initialData,
  condominiumId,
}: CondominiumWizardProps = {}) {
  const router = useRouter()
  const { toast } = useToast()
  const isEdit = mode === 'edit'

  const [step, setStep] = useState<CondominiumWizardStepId>(() => {
    if (isEdit) return CONDOMINIUM_WIZARD_DEFAULT_STEP
    const draft = getCondominiumWizardDraft()
    return draft.step ?? CONDOMINIUM_WIZARD_DEFAULT_STEP
  })

  const [data, setData] = useState<CondominiumFormData>(() => {
    if (isEdit && initialData) return initialData
    const draft = getCondominiumWizardDraft()
    return draft.data ?? defaultCondominiumFormData()
  })

  const [errors, setErrors] = useState<CondominiumFormErrors>({})
  const [warnedSteps, setWarnedSteps] = useState<Set<CondominiumWizardStepId>>(
    new Set(),
  )
  const [submitting, setSubmitting] = useState(false)
  const [cepLoading, setCepLoading] = useState(false)

  const stepIndex = CONDOMINIUM_WIZARD_STEPS.findIndex((s) => s.id === step)

  const stepsWithErrors = useMemo(() => {
    const set = new Set<CondominiumWizardStepId>()
    for (const s of CONDOMINIUM_WIZARD_STEPS) {
      if (condominiumStepHasErrors(s.id, errors)) set.add(s.id)
    }
    return set
  }, [errors])

  function goToStep(next: string) {
    const id = next as CondominiumWizardStepId
    setStep(id)
    if (!isEdit) saveCondominiumWizardDraft({ step: id })
  }

  function handleCancel() {
    if (!isEdit) clearCondominiumWizardDraft()
    router.push('/imoveis/condominios')
  }

  const clearCurrentStepWarning = useCallback(
    (currentStep: CondominiumWizardStepId) => {
      setWarnedSteps((prev) => {
        if (!prev.has(currentStep)) return prev
        const next = new Set(prev)
        next.delete(currentStep)
        return next
      })
    },
    [],
  )

  function patch(partial: Partial<CondominiumFormData>) {
    setData((prev) => {
      const next = { ...prev, ...partial }
      if (!isEdit) saveCondominiumWizardDraft({ data: next })
      return next
    })
    setErrors({})
    clearCurrentStepWarning(step)
  }

  function patchAddress(partial: Partial<CondominiumAddressFormData>) {
    setData((prev) => {
      const next = { ...prev, address: { ...prev.address, ...partial } }
      if (!isEdit) saveCondominiumWizardDraft({ data: next })
      return next
    })
    setErrors({})
    clearCurrentStepWarning(step)
  }

  async function handleCepBlur() {
    const digits = onlyDigits(data.address.postal_code)
    if (digits.length !== 8) return
    setCepLoading(true)
    const result = await fetchAddressByCep(digits)
    setCepLoading(false)
    if (!result) return
    patchAddress({
      street: result.street || data.address.street,
      neighborhood: result.neighborhood || data.address.neighborhood,
      city: result.city || data.address.city,
      state: result.state || data.address.state,
    })
  }

  function handleContinue(nextStepId: CondominiumWizardStepId) {
    const allErrors = validateCondominiumForm(data)
    if (condominiumStepHasErrors(step, allErrors)) {
      setWarnedSteps((prev) => new Set(prev).add(step))
    }
    goToStep(nextStepId)
  }

  async function handleFinish() {
    const nextErrors = validateCondominiumForm(data)
    setErrors(nextErrors)
    setWarnedSteps(new Set())

    if (hasCondominiumFormErrors(nextErrors)) {
      const target = firstCondominiumStepWithErrors(nextErrors)
      if (target) goToStep(target)
      return
    }

    setSubmitting(true)
    const result = isEdit && condominiumId
      ? await updateCondominiumAction(condominiumId, data)
      : await createCondominiumAction(data)
    setSubmitting(false)

    if (!result.success) {
      toast({
        title: isEdit ? 'Erro ao atualizar condomínio' : 'Erro ao cadastrar condomínio',
        description: result.error ?? 'Ocorreu um erro inesperado.',
        variant: 'error',
      })
      return
    }

    toast({
      title: isEdit ? 'Condomínio atualizado' : 'Condomínio cadastrado',
      description: isEdit
        ? 'As alterações foram salvas com sucesso.'
        : 'O condomínio foi criado com sucesso.',
      variant: 'success',
    })

    if (!isEdit) clearCondominiumWizardDraft()
    router.push('/imoveis/condominios')
  }

  const footerConfig = useMemo(() => {
    const prev =
      stepIndex > 0 ? CONDOMINIUM_WIZARD_STEPS[stepIndex - 1].id : null
    const next =
      stepIndex < CONDOMINIUM_WIZARD_STEPS.length - 1
        ? CONDOMINIUM_WIZARD_STEPS[stepIndex + 1].id
        : null

    if (step === 'address') {
      return {
        hint: CONDOMINIUM_STEP_HINTS.address,
        onBack: prev ? () => goToStep(prev) : undefined,
        onNext: handleFinish,
        nextLabel: submitting
          ? 'Salvando…'
          : isEdit
            ? 'Salvar alterações'
            : 'Concluir cadastro',
        nextDisabled: submitting,
      }
    }

    return {
      hint: CONDOMINIUM_STEP_HINTS[step],
      onBack: prev ? () => goToStep(prev) : undefined,
      onNext: next ? () => handleContinue(next) : undefined,
      nextLabel: 'Continuar',
      nextDisabled: false,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, stepIndex, submitting, data])

  function renderStep() {
    switch (step) {
      case 'identification':
        return (
          <StepCondominiumIdentification data={data} errors={errors} patch={patch} />
        )
      case 'address':
        return (
          <StepCondominiumAddress
            data={data}
            errors={errors}
            patchAddress={patchAddress}
            handleCepBlur={handleCepBlur}
            cepLoading={cepLoading}
          />
        )
      default:
        return (
          <StepCondominiumIdentification data={data} errors={errors} patch={patch} />
        )
    }
  }

  return (
    <div className="contract-create-page">
      <aside className="contract-create-sidebar">
        <button
          type="button"
          className="contract-create-back"
          onClick={handleCancel}
        >
          <ArrowLeft size={16} />
          Condomínios
        </button>

        <WizardStepper
          steps={CONDOMINIUM_WIZARD_STEPS}
          currentStep={step}
          onStepClick={goToStep}
          stepsWithWarnings={warnedSteps}
          stepsWithErrors={stepsWithErrors}
          ariaLabel="Etapas do condomínio"
        />
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
