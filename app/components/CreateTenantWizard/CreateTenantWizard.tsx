'use client'

import {
  createPhone,
  defaultOwnerFormData,
  hasFormErrors,
  validateOwnerForm,
} from '@/lib/owners/form'
import type {
  OwnerFormData,
  OwnerFormErrors,
  OwnerPhone,
} from '@/lib/owners/types'
import {
  createTenantAction,
  updateTenantAction,
} from '@/lib/tenants/actions'
import { buildTenantPayload } from '@/lib/tenants/api'
import {
  TENANT_STEP_HINTS,
  TENANT_WIZARD_DEFAULT_STEP,
  TENANT_WIZARD_STEPS,
  firstTenantStepWithErrors,
  tenantStepHasErrors,
} from '@/lib/tenants/wizard/constants'
import {
  clearTenantWizardDraft,
  getTenantWizardDraft,
  saveTenantWizardDraft,
} from '@/lib/tenants/wizard/draft'
import type { TenantWizardStepId } from '@/lib/tenants/wizard/types'
import { fetchAddressByCep } from '@/lib/utils/cep/fetch-viacep'
import { onlyDigits } from '@/lib/utils/validation'
import { useToast } from '@/lib/toast/use-toast'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { WizardStepper } from '@/app/components/WizardStepper/WizardStepper'
import { WizardStepFooter } from '@/app/components/WizardStepFooter/WizardStepFooter'
import { StepIdentification } from '@/app/components/CreateOwnerWizard/StepIdentification'
import { StepPersonal } from '@/app/components/CreateOwnerWizard/StepPersonal'
import { StepContact } from '@/app/components/CreateOwnerWizard/StepContact'
import { StepAddress } from '@/app/components/CreateOwnerWizard/StepAddress'

function defaultTenantFormData(): OwnerFormData {
  return { ...defaultOwnerFormData(), is_renter: true }
}

export interface TenantWizardProps {
  mode?: 'create' | 'edit'
  initialData?: OwnerFormData
  inquilinoId?: string
}

export function CreateTenantWizard({
  mode = 'create',
  initialData,
  inquilinoId,
}: TenantWizardProps = {}) {
  const router = useRouter()
  const { toast } = useToast()
  const isEdit = mode === 'edit'

  const [step, setStep] = useState<TenantWizardStepId>(() => {
    if (isEdit) return TENANT_WIZARD_DEFAULT_STEP
    const draft = getTenantWizardDraft()
    return draft.step ?? TENANT_WIZARD_DEFAULT_STEP
  })

  const [data, setData] = useState<OwnerFormData>(() => {
    if (isEdit && initialData) return initialData
    const draft = getTenantWizardDraft()
    return draft.data ?? defaultTenantFormData()
  })

  const [errors, setErrors] = useState<OwnerFormErrors>({})
  const [warnedSteps, setWarnedSteps] = useState<Set<TenantWizardStepId>>(
    new Set(),
  )
  const [submitting, setSubmitting] = useState(false)
  const [cepLoading, setCepLoading] = useState(false)

  const stepIndex = TENANT_WIZARD_STEPS.findIndex((s) => s.id === step)

  const stepsWithErrors = useMemo(() => {
    const set = new Set<TenantWizardStepId>()
    for (const s of TENANT_WIZARD_STEPS) {
      if (tenantStepHasErrors(s.id, errors)) set.add(s.id)
    }
    return set
  }, [errors])

  function goToStep(next: string) {
    const id = next as TenantWizardStepId
    setStep(id)
    if (!isEdit) saveTenantWizardDraft({ step: id })
  }

  function handleCancel() {
    if (!isEdit) clearTenantWizardDraft()
    router.push('/locacao/inquilinos')
  }

  const clearCurrentStepWarning = useCallback(
    (currentStep: TenantWizardStepId) => {
      setWarnedSteps((prev) => {
        if (!prev.has(currentStep)) return prev
        const next = new Set(prev)
        next.delete(currentStep)
        return next
      })
    },
    [],
  )

  function patch(partial: Partial<OwnerFormData>) {
    setData((prev) => {
      const next = { ...prev, ...partial }
      if (!isEdit) saveTenantWizardDraft({ data: next })
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

  function updatePhone(
    id: string,
    partial: Partial<OwnerPhone>,
  ) {
    setData((prev) => {
      const next = {
        ...prev,
        phones: prev.phones.map((t) =>
          t.id === id ? { ...t, ...partial } : t,
        ),
      }
      if (!isEdit) saveTenantWizardDraft({ data: next })
      return next
    })
    setErrors((prev) => {
      const current = prev.phones
      if (!current?.[id]) return prev
      const next = { ...current }
      delete next[id]
      return {
        ...prev,
        phones: Object.keys(next).length > 0 ? next : undefined,
      }
    })
    clearCurrentStepWarning(step)
  }

  function addPhone() {
    setData((prev) => {
      const next = {
        ...prev,
        phones: [...prev.phones, createPhone()],
      }
      if (!isEdit) saveTenantWizardDraft({ data: next })
      return next
    })
  }

  function removePhone(id: string) {
    setData((prev) => {
      const next = {
        ...prev,
        phones:
          prev.phones.length <= 1
            ? prev.phones
            : prev.phones.filter((t) => t.id !== id),
      }
      if (!isEdit) saveTenantWizardDraft({ data: next })
      return next
    })
  }

  function handleContinue(nextStepId: TenantWizardStepId) {
    const allErrors = validateOwnerForm(data)
    if (tenantStepHasErrors(step, allErrors)) {
      setWarnedSteps((prev) => new Set(prev).add(step))
    }
    goToStep(nextStepId)
  }

  async function handleFinish() {
    const nextErrors = validateOwnerForm(data)
    delete nextErrors.bank_account
    setErrors(nextErrors)
    setWarnedSteps(new Set())

    if (hasFormErrors(nextErrors)) {
      const target = firstTenantStepWithErrors(nextErrors)
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
      console.log('[cadastro inquilino] payload:', buildTenantPayload(data))
    }
    const result =
      isEdit && inquilinoId
        ? await updateTenantAction(inquilinoId, data)
        : await createTenantAction(data)
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

    if (!isEdit) clearTenantWizardDraft()
    router.push('/locacao/inquilinos')
  }

  const footerConfig = useMemo(() => {
    const prev =
      stepIndex > 0 ? TENANT_WIZARD_STEPS[stepIndex - 1].id : null
    const next =
      stepIndex < TENANT_WIZARD_STEPS.length - 1
        ? TENANT_WIZARD_STEPS[stepIndex + 1].id
        : null

    if (step === 'address') {
      return {
        hint: TENANT_STEP_HINTS.address,
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
      hint: TENANT_STEP_HINTS[step],
      onBack: prev ? () => goToStep(prev) : undefined,
      onNext: next ? () => handleContinue(next) : undefined,
      nextLabel: 'Continuar',
      nextDisabled: false,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, stepIndex, submitting, data, isEdit])

  function renderStep() {
    switch (step) {
      case 'identification':
        return (
          <StepIdentification
            data={data}
            errors={errors}
            patch={patch}
            hideIsRenterToggle
          />
        )
      case 'personal':
        return <StepPersonal data={data} errors={errors} patch={patch} />
      case 'contact':
        return (
          <StepContact
            data={data}
            errors={errors}
            addPhone={addPhone}
            removePhone={removePhone}
            updatePhone={updatePhone}
          />
        )
      case 'address':
        return (
          <StepAddress
            data={data}
            errors={errors}
            patch={patch}
            handleCepBlur={handleCepBlur}
            cepLoading={cepLoading}
          />
        )
      default:
        return (
          <StepIdentification
            data={data}
            errors={errors}
            patch={patch}
            hideIsRenterToggle
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
          Inquilinos
        </button>

        <WizardStepper
          steps={TENANT_WIZARD_STEPS}
          currentStep={step}
          onStepClick={goToStep}
          stepsWithWarnings={warnedSteps}
          stepsWithErrors={stepsWithErrors}
          ariaLabel="Etapas do inquilino"
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
