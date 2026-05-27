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
  createInquilinoAction,
  updateInquilinoAction,
} from '@/lib/inquilinos/actions'
import { buildInquilinoPayload } from '@/lib/inquilinos/api'
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
import { useToast } from '@/lib/toast/use-toast'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { WizardStepper } from '@/app/components/WizardStepper/WizardStepper'
import { WizardStepFooter } from '@/app/components/WizardStepFooter/WizardStepFooter'
import { StepIdentificacao } from '@/app/components/CriarProprietarioWizard/StepIdentificacao'
import { StepPessoal } from '@/app/components/CriarProprietarioWizard/StepPessoal'
import { StepContato } from '@/app/components/CriarProprietarioWizard/StepContato'
import { StepEndereco } from '@/app/components/CriarProprietarioWizard/StepEndereco'

function defaultInquilinoFormData(): ProprietarioFormData {
  return { ...defaultProprietarioFormData(), is_renter: true }
}

export interface InquilinoWizardProps {
  mode?: 'create' | 'edit'
  initialData?: ProprietarioFormData
  inquilinoId?: string
}

export function CriarInquilinoWizard({
  mode = 'create',
  initialData,
  inquilinoId,
}: InquilinoWizardProps = {}) {
  const router = useRouter()
  const { toast } = useToast()
  const isEdit = mode === 'edit'

  const [step, setStep] = useState<InquilinoWizardStepId>(() => {
    if (isEdit) return INQUILINO_WIZARD_DEFAULT_STEP
    const draft = getInquilinoWizardDraft()
    return draft.step ?? INQUILINO_WIZARD_DEFAULT_STEP
  })

  const [data, setData] = useState<ProprietarioFormData>(() => {
    if (isEdit && initialData) return initialData
    const draft = getInquilinoWizardDraft()
    return draft.data ?? defaultInquilinoFormData()
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
    const id = next as InquilinoWizardStepId
    setStep(id)
    if (!isEdit) saveInquilinoWizardDraft({ step: id })
  }

  function handleCancel() {
    if (!isEdit) clearInquilinoWizardDraft()
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
      if (!isEdit) saveInquilinoWizardDraft({ data: next })
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
      if (!isEdit) saveInquilinoWizardDraft({ data: next })
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
      if (!isEdit) saveInquilinoWizardDraft({ data: next })
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
      if (!isEdit) saveInquilinoWizardDraft({ data: next })
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

    if (isEdit && !inquilinoId) {
      toast({
        title: 'Erro ao salvar',
        description:
          'Identificador do inquilino não encontrado. Volte à lista e tente novamente.',
        variant: 'error',
      })
      return
    }

    setSubmitting(true)
    if (!isEdit) {
      console.log('[cadastro inquilino] payload:', buildInquilinoPayload(data))
    }
    const result =
      isEdit && inquilinoId
        ? await updateInquilinoAction(inquilinoId, data)
        : await createInquilinoAction(data)
    setSubmitting(false)

    if (!result.success) {
      toast({
        title: isEdit ? 'Erro ao atualizar inquilino' : 'Erro ao cadastrar inquilino',
        description: result.error ?? 'Ocorreu um erro inesperado.',
        variant: 'error',
      })
      return
    }

    toast({
      title: isEdit ? 'Inquilino atualizado' : 'Inquilino cadastrado',
      description: isEdit
        ? 'As alterações foram salvas com sucesso.'
        : 'O inquilino foi criado com sucesso.',
      variant: 'success',
    })

    if (!isEdit) clearInquilinoWizardDraft()
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
        nextLabel: submitting
          ? 'Salvando…'
          : isEdit
            ? 'Salvar alterações'
            : 'Concluir cadastro',
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
  }, [step, stepIndex, submitting, data, isEdit])

  function renderStep() {
    switch (step) {
      case 'identificacao':
        return (
          <StepIdentificacao
            data={data}
            errors={errors}
            patch={patch}
            hideIsRenterToggle
          />
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
          <StepIdentificacao
            data={data}
            errors={errors}
            patch={patch}
            hideIsRenterToggle
          />
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
