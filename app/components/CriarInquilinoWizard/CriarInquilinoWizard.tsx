'use client'

import {
  createTelefone,
  defaultProprietarioFormData,
  hasFormErrors,
  validateProprietarioForm,
} from '@/lib/proprietarios/form'
import type {
  ProprietarioFormData,
  ProprietarioFormErrors,
  ProprietarioTelefone,
} from '@/lib/proprietarios/types'
import {
  INQUILINO_STEP_HINTS,
  INQUILINO_WIZARD_DEFAULT_STEP,
  INQUILINO_WIZARD_STEPS,
  firstInquilinoStepWithErrors,
  inquilinoStepHasErrors,
} from '@/lib/inquilinos/wizard/constants'
import {
  clearInquilinoWizardDraft,
  getInquilinoWizardDraft,
  saveInquilinoWizardDraft,
} from '@/lib/inquilinos/wizard/draft'
import type { InquilinoWizardStepId } from '@/lib/inquilinos/wizard/types'
import { fetchAddressByCep } from '@/lib/utils/cep/fetch-viacep'
import { onlyDigits } from '@/lib/utils/validation'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { WizardStepper } from '@/app/components/WizardStepper/WizardStepper'
import { WizardStepFooter } from '@/app/components/WizardStepFooter/WizardStepFooter'
import { StepIdentificacao } from '@/app/components/CriarProprietarioWizard/StepIdentificacao'
import { StepPessoal } from '@/app/components/CriarProprietarioWizard/StepPessoal'
import { StepContato } from '@/app/components/CriarProprietarioWizard/StepContato'
import { StepEndereco } from '@/app/components/CriarProprietarioWizard/StepEndereco'

export function CriarInquilinoWizard() {
  const router = useRouter()

  const [step, setStep] = useState<InquilinoWizardStepId>(() => {
    const draft = getInquilinoWizardDraft()
    return draft.step ?? INQUILINO_WIZARD_DEFAULT_STEP
  })

  const [data, setData] = useState<ProprietarioFormData>(() => {
    const draft = getInquilinoWizardDraft()
    return draft.data ?? defaultProprietarioFormData()
  })

  const [errors, setErrors] = useState<ProprietarioFormErrors>({})
  const [warnedSteps, setWarnedSteps] = useState<Set<InquilinoWizardStepId>>(
    new Set(),
  )
  const [submitting, setSubmitting] = useState(false)
  const [cepLoading, setCepLoading] = useState(false)

  const stepIndex = INQUILINO_WIZARD_STEPS.findIndex((s) => s.id === step)

  const stepsWithErrors = useMemo(() => {
    const set = new Set<InquilinoWizardStepId>()
    for (const s of INQUILINO_WIZARD_STEPS) {
      if (inquilinoStepHasErrors(s.id, errors)) set.add(s.id)
    }
    return set
  }, [errors])

  function goToStep(next: string) {
    setStep(next as InquilinoWizardStepId)
    saveInquilinoWizardDraft({ step: next as InquilinoWizardStepId })
  }

  function handleCancel() {
    clearInquilinoWizardDraft()
    router.push('/locacao/inquilinos')
  }

  const clearCurrentStepWarning = useCallback(
    (currentStep: InquilinoWizardStepId) => {
      setWarnedSteps((prev) => {
        if (!prev.has(currentStep)) return prev
        const next = new Set(prev)
        next.delete(currentStep)
        return next
      })
    },
    [],
  )

  function patch(partial: Partial<ProprietarioFormData>) {
    setData((prev) => {
      const next = { ...prev, ...partial }
      saveInquilinoWizardDraft({ data: next })
      return next
    })
    setErrors({})
    clearCurrentStepWarning(step)
  }

  async function handleCepBlur() {
    const digits = onlyDigits(data.postal_code)
    if (digits.length !== 8) return
    setCepLoading(true)
    const address = await fetchAddressByCep(digits)
    setCepLoading(false)
    if (!address) return
    patch({
      street: address.street || data.street,
      neighborhood: address.neighborhood || data.neighborhood,
      city: address.city || data.city,
      state: address.state || data.state,
    })
  }

  function updateTelefone(
    id: string,
    partial: Partial<ProprietarioTelefone>,
  ) {
    setData((prev) => {
      const next = {
        ...prev,
        telefones: prev.telefones.map((t) =>
          t.id === id ? { ...t, ...partial } : t,
        ),
      }
      saveInquilinoWizardDraft({ data: next })
      return next
    })
    setErrors((prev) => {
      const current = prev.telefones
      if (!current?.[id]) return prev
      const next = { ...current }
      delete next[id]
      return {
        ...prev,
        telefones: Object.keys(next).length > 0 ? next : undefined,
      }
    })
    clearCurrentStepWarning(step)
  }

  function addTelefone() {
    setData((prev) => {
      const next = {
        ...prev,
        telefones: [...prev.telefones, createTelefone()],
      }
      saveInquilinoWizardDraft({ data: next })
      return next
    })
  }

  function removeTelefone(id: string) {
    setData((prev) => {
      const next = {
        ...prev,
        telefones:
          prev.telefones.length <= 1
            ? prev.telefones
            : prev.telefones.filter((t) => t.id !== id),
      }
      saveInquilinoWizardDraft({ data: next })
      return next
    })
  }

  function handleContinue(nextStepId: InquilinoWizardStepId) {
    const allErrors = validateProprietarioForm(data)
    if (inquilinoStepHasErrors(step, allErrors)) {
      setWarnedSteps((prev) => new Set(prev).add(step))
    }
    goToStep(nextStepId)
  }

  async function handleFinish() {
    const nextErrors = validateProprietarioForm(data)
    delete nextErrors.bank_account
    setErrors(nextErrors)
    setWarnedSteps(new Set())

    if (hasFormErrors(nextErrors)) {
      const target = firstInquilinoStepWithErrors(nextErrors)
      if (target) goToStep(target)
      return
    }

    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 400))
    setSubmitting(false)
    clearInquilinoWizardDraft()
    router.push('/locacao/inquilinos')
  }

  const footerConfig = useMemo(() => {
    const prev =
      stepIndex > 0 ? INQUILINO_WIZARD_STEPS[stepIndex - 1].id : null
    const next =
      stepIndex < INQUILINO_WIZARD_STEPS.length - 1
        ? INQUILINO_WIZARD_STEPS[stepIndex + 1].id
        : null

    if (step === 'endereco') {
      return {
        hint: INQUILINO_STEP_HINTS.endereco,
        onBack: prev ? () => goToStep(prev) : undefined,
        onNext: handleFinish,
        nextLabel: submitting ? 'Salvando…' : 'Concluir cadastro',
        nextDisabled: submitting,
      }
    }

    return {
      hint: INQUILINO_STEP_HINTS[step],
      onBack: prev ? () => goToStep(prev) : undefined,
      onNext: next ? () => handleContinue(next) : undefined,
      nextLabel: 'Continuar',
      nextDisabled: false,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, stepIndex, submitting, data])

  function renderStep() {
    switch (step) {
      case 'identificacao':
        return (
          <StepIdentificacao data={data} errors={errors} patch={patch} />
        )
      case 'pessoal':
        return <StepPessoal data={data} errors={errors} patch={patch} />
      case 'contato':
        return (
          <StepContato
            data={data}
            errors={errors}
            addTelefone={addTelefone}
            removeTelefone={removeTelefone}
            updateTelefone={updateTelefone}
          />
        )
      case 'endereco':
        return (
          <StepEndereco
            data={data}
            errors={errors}
            patch={patch}
            handleCepBlur={handleCepBlur}
            cepLoading={cepLoading}
          />
        )
      default:
        return (
          <StepIdentificacao data={data} errors={errors} patch={patch} />
        )
    }
  }

  return (
    <div className="contrato-criar-page">
      <aside className="contrato-criar-sidebar">
        <button
          type="button"
          className="contrato-criar-back"
          onClick={handleCancel}
        >
          <ArrowLeft size={16} />
          Inquilinos
        </button>

        <WizardStepper
          steps={INQUILINO_WIZARD_STEPS}
          currentStep={step}
          onStepClick={goToStep}
          stepsWithWarnings={warnedSteps}
          stepsWithErrors={stepsWithErrors}
          ariaLabel="Etapas do inquilino"
        />
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
