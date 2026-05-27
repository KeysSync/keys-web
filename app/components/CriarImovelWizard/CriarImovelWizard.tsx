'use client'

import {
  defaultImovelFormData,
  hasImovelFormErrors,
  validateImovelForm,
} from '@/lib/imoveis/form'
import type { ImovelAddressFormData, ImovelFormData, ImovelFormErrors } from '@/lib/imoveis/types'
import type { Category, Subcategory } from '@/lib/imoveis/api'
import { createImovelAction, updateImovelAction } from '@/lib/imoveis/actions'
import {
  IMOVEL_STEP_HINTS,
  IMOVEL_WIZARD_DEFAULT_STEP,
  IMOVEL_WIZARD_STEPS,
  firstImovelStepWithErrors,
  imovelStepHasErrors,
} from '@/lib/imoveis/wizard/constants'
import {
  clearImovelWizardDraft,
  getImovelWizardDraft,
  saveImovelWizardDraft,
} from '@/lib/imoveis/wizard/draft'
import type { ImovelWizardStepId } from '@/lib/imoveis/wizard/types'
import { fetchAddressByCep } from '@/lib/utils/cep/fetch-viacep'
import { onlyDigits } from '@/lib/utils/validation'
import { useToast } from '@/lib/toast/use-toast'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { WizardStepper } from '@/app/components/WizardStepper/WizardStepper'
import { WizardStepFooter } from '@/app/components/WizardStepFooter/WizardStepFooter'
import { StepImovelIdentificacao } from './StepImovelIdentificacao'
import { StepImovelLocalizacao } from './StepImovelLocalizacao'

export interface ImovelWizardProps {
  mode?: 'create' | 'edit'
  initialData?: ImovelFormData
  imovelId?: string
  categories?: Category[]
  subcategories?: Subcategory[]
}

export function CriarImovelWizard({
  mode = 'create',
  initialData,
  imovelId,
  categories = [],
  subcategories = [],
}: ImovelWizardProps = {}) {
  const router = useRouter()
  const { toast } = useToast()
  const isEdit = mode === 'edit'

  const [step, setStep] = useState<ImovelWizardStepId>(() => {
    if (isEdit) return IMOVEL_WIZARD_DEFAULT_STEP
    const draft = getImovelWizardDraft()
    return draft.step ?? IMOVEL_WIZARD_DEFAULT_STEP
  })

  const [data, setData] = useState<ImovelFormData>(() => {
    if (isEdit && initialData) return initialData
    const draft = getImovelWizardDraft()
    return draft.data ?? defaultImovelFormData()
  })

  const [errors, setErrors] = useState<ImovelFormErrors>({})
  const [warnedSteps, setWarnedSteps] = useState<Set<ImovelWizardStepId>>(
    new Set(),
  )
  const [submitting, setSubmitting] = useState(false)
  const [cepLoading, setCepLoading] = useState(false)

  const stepIndex = IMOVEL_WIZARD_STEPS.findIndex((s) => s.id === step)

  const stepsWithErrors = useMemo(() => {
    const set = new Set<ImovelWizardStepId>()
    for (const s of IMOVEL_WIZARD_STEPS) {
      if (imovelStepHasErrors(s.id, errors)) set.add(s.id)
    }
    return set
  }, [errors])

  function goToStep(next: string) {
    const id = next as ImovelWizardStepId
    setStep(id)
    if (!isEdit) saveImovelWizardDraft({ step: id })
  }

  function handleCancel() {
    if (!isEdit) clearImovelWizardDraft()
    router.push('/imoveis')
  }

  const clearCurrentStepWarning = useCallback(
    (currentStep: ImovelWizardStepId) => {
      setWarnedSteps((prev) => {
        if (!prev.has(currentStep)) return prev
        const next = new Set(prev)
        next.delete(currentStep)
        return next
      })
    },
    [],
  )

  function patch(partial: Partial<ImovelFormData>) {
    setData((prev) => {
      const next = { ...prev, ...partial }
      if (!isEdit) saveImovelWizardDraft({ data: next })
      return next
    })
    setErrors({})
    clearCurrentStepWarning(step)
  }

  function patchAddress(partial: Partial<ImovelAddressFormData>) {
    setData((prev) => {
      const next = { ...prev, address: { ...prev.address, ...partial } }
      if (!isEdit) saveImovelWizardDraft({ data: next })
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

  function handleContinue(nextStepId: ImovelWizardStepId) {
    const allErrors = validateImovelForm(data)
    if (imovelStepHasErrors(step, allErrors)) {
      setWarnedSteps((prev) => new Set(prev).add(step))
    }
    goToStep(nextStepId)
  }

  async function handleFinish() {
    const nextErrors = validateImovelForm(data)
    setErrors(nextErrors)
    setWarnedSteps(new Set())

    if (hasImovelFormErrors(nextErrors)) {
      const target = firstImovelStepWithErrors(nextErrors)
      if (target) goToStep(target)
      return
    }

    setSubmitting(true)
    const result = isEdit && imovelId
      ? await updateImovelAction(imovelId, data)
      : await createImovelAction(data)
    setSubmitting(false)

    if (!result.success) {
      toast({
        title: isEdit ? 'Erro ao atualizar imóvel' : 'Erro ao cadastrar imóvel',
        description: result.error ?? 'Ocorreu um erro inesperado.',
        variant: 'error',
      })
      return
    }

    toast({
      title: isEdit ? 'Imóvel atualizado' : 'Imóvel cadastrado',
      description: isEdit
        ? 'As alterações foram salvas com sucesso.'
        : 'O imóvel foi criado com sucesso.',
      variant: 'success',
    })

    if (!isEdit) clearImovelWizardDraft()
    router.push('/imoveis')
  }

  const footerConfig = useMemo(() => {
    const prev =
      stepIndex > 0 ? IMOVEL_WIZARD_STEPS[stepIndex - 1].id : null
    const next =
      stepIndex < IMOVEL_WIZARD_STEPS.length - 1
        ? IMOVEL_WIZARD_STEPS[stepIndex + 1].id
        : null

    if (step === 'localizacao') {
      return {
        hint: IMOVEL_STEP_HINTS.localizacao,
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
      hint: IMOVEL_STEP_HINTS[step],
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
          <StepImovelIdentificacao
            data={data}
            errors={errors}
            patch={patch}
            categories={categories}
            subcategories={subcategories}
          />
        )
      case 'localizacao':
        return (
          <StepImovelLocalizacao
            data={data}
            errors={errors}
            patchAddress={patchAddress}
            handleCepBlur={handleCepBlur}
            cepLoading={cepLoading}
          />
        )
      default:
        return (
          <StepImovelIdentificacao
            data={data}
            errors={errors}
            patch={patch}
            categories={categories}
            subcategories={subcategories}
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
          Imóveis
        </button>

        <WizardStepper
          steps={IMOVEL_WIZARD_STEPS}
          currentStep={step}
          onStepClick={goToStep}
          stepsWithWarnings={warnedSteps}
          stepsWithErrors={stepsWithErrors}
          ariaLabel="Etapas do imóvel"
        />
      </aside>

      <div className="contrato-criar-main">
        <div className="contrato-criar-main__body">
          {renderStep()}
        </div>

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
