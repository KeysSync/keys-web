'use client'

import {
  defaultPropertyFormData,
  hasPropertyFormErrors,
  validatePropertyForm,
} from '@/lib/properties/form'
import type { PropertyAddressFormData, PropertyFormData, PropertyFormErrors } from '@/lib/properties/types'
import type { Category, Subcategory } from '@/lib/properties/api'
import { createPropertyAction, updatePropertyAction } from '@/lib/properties/actions'
import {
  PROPERTY_STEP_HINTS,
  PROPERTY_WIZARD_DEFAULT_STEP,
  PROPERTY_WIZARD_STEPS,
  firstPropertyStepWithErrors,
  propertyStepHasErrors,
} from '@/lib/properties/wizard/constants'
import {
  clearPropertyWizardDraft,
  getPropertyWizardDraft,
  savePropertyWizardDraft,
} from '@/lib/properties/wizard/draft'
import type { PropertyWizardStepId } from '@/lib/properties/wizard/types'
import { fetchAddressByCep } from '@/lib/utils/cep/fetch-viacep'
import { onlyDigits } from '@/lib/utils/validation'
import { useToast } from '@/lib/toast/use-toast'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { WizardStepper } from '@/app/components/WizardStepper/WizardStepper'
import { WizardStepFooter } from '@/app/components/WizardStepFooter/WizardStepFooter'
import { StepPropertyIdentification } from './StepPropertyIdentification'
import { StepPropertyLocation } from './StepPropertyLocation'

export interface PropertyWizardProps {
  mode?: 'create' | 'edit'
  initialData?: PropertyFormData
  propertyId?: string
  categories?: Category[]
  subcategories?: Subcategory[]
}

export function CreatePropertyWizard({
  mode = 'create',
  initialData,
  propertyId,
  categories = [],
  subcategories = [],
}: PropertyWizardProps = {}) {
  const router = useRouter()
  const { toast } = useToast()
  const isEdit = mode === 'edit'

  const [step, setStep] = useState<PropertyWizardStepId>(() => {
    if (isEdit) return PROPERTY_WIZARD_DEFAULT_STEP
    const draft = getPropertyWizardDraft()
    return draft.step ?? PROPERTY_WIZARD_DEFAULT_STEP
  })

  const [data, setData] = useState<PropertyFormData>(() => {
    if (isEdit && initialData) return initialData
    const draft = getPropertyWizardDraft()
    return draft.data ?? defaultPropertyFormData()
  })

  const [errors, setErrors] = useState<PropertyFormErrors>({})
  const [warnedSteps, setWarnedSteps] = useState<Set<PropertyWizardStepId>>(
    new Set(),
  )
  const [submitting, setSubmitting] = useState(false)
  const [cepLoading, setCepLoading] = useState(false)

  const stepIndex = PROPERTY_WIZARD_STEPS.findIndex((s) => s.id === step)

  const stepsWithErrors = useMemo(() => {
    const set = new Set<PropertyWizardStepId>()
    for (const s of PROPERTY_WIZARD_STEPS) {
      if (propertyStepHasErrors(s.id, errors)) set.add(s.id)
    }
    return set
  }, [errors])

  function goToStep(next: string) {
    const id = next as PropertyWizardStepId
    setStep(id)
    if (!isEdit) savePropertyWizardDraft({ step: id })
  }

  function handleCancel() {
    if (!isEdit) clearPropertyWizardDraft()
    router.push('/imoveis')
  }

  const clearCurrentStepWarning = useCallback(
    (currentStep: PropertyWizardStepId) => {
      setWarnedSteps((prev) => {
        if (!prev.has(currentStep)) return prev
        const next = new Set(prev)
        next.delete(currentStep)
        return next
      })
    },
    [],
  )

  function patch(partial: Partial<PropertyFormData>) {
    setData((prev) => {
      const next = { ...prev, ...partial }
      if (!isEdit) savePropertyWizardDraft({ data: next })
      return next
    })
    setErrors({})
    clearCurrentStepWarning(step)
  }

  function patchAddress(partial: Partial<PropertyAddressFormData>) {
    setData((prev) => {
      const next = { ...prev, address: { ...prev.address, ...partial } }
      if (!isEdit) savePropertyWizardDraft({ data: next })
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

  function handleContinue(nextStepId: PropertyWizardStepId) {
    const allErrors = validatePropertyForm(data)
    if (propertyStepHasErrors(step, allErrors)) {
      setWarnedSteps((prev) => new Set(prev).add(step))
    }
    goToStep(nextStepId)
  }

  async function handleFinish() {
    const nextErrors = validatePropertyForm(data)
    setErrors(nextErrors)
    setWarnedSteps(new Set())

    if (hasPropertyFormErrors(nextErrors)) {
      const target = firstPropertyStepWithErrors(nextErrors)
      if (target) goToStep(target)
      return
    }

    setSubmitting(true)
    const result = isEdit && propertyId
      ? await updatePropertyAction(propertyId, data)
      : await createPropertyAction(data)
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

    if (!isEdit) clearPropertyWizardDraft()
    router.push('/imoveis')
  }

  const footerConfig = useMemo(() => {
    const prev =
      stepIndex > 0 ? PROPERTY_WIZARD_STEPS[stepIndex - 1].id : null
    const next =
      stepIndex < PROPERTY_WIZARD_STEPS.length - 1
        ? PROPERTY_WIZARD_STEPS[stepIndex + 1].id
        : null

    if (step === 'location') {
      return {
        hint: PROPERTY_STEP_HINTS.location,
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
      hint: PROPERTY_STEP_HINTS[step],
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
          <StepPropertyIdentification
            data={data}
            errors={errors}
            patch={patch}
            categories={categories}
            subcategories={subcategories}
          />
        )
      case 'location':
        return (
          <StepPropertyLocation
            data={data}
            errors={errors}
            patchAddress={patchAddress}
            handleCepBlur={handleCepBlur}
            cepLoading={cepLoading}
          />
        )
      default:
        return (
          <StepPropertyIdentification
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
    <div className="contract-create-page">
      <aside className="contract-create-sidebar">
        <button
          type="button"
          className="contract-create-back"
          onClick={handleCancel}
        >
          <ArrowLeft size={16} />
          Imóveis
        </button>

        <WizardStepper
          steps={PROPERTY_WIZARD_STEPS}
          currentStep={step}
          onStepClick={goToStep}
          stepsWithWarnings={warnedSteps}
          stepsWithErrors={stepsWithErrors}
          ariaLabel="Etapas do imóvel"
        />
      </aside>

      <div className="contract-create-main">
        <div className="contract-create-main__body">
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
