'use client'

import {
  createBankAccount,
  createPhone,
  defaultOwnerFormData,
  hasFormErrors,
  validateOwnerForm,
} from '@/lib/owners/form'
import {
  createOwnerAction,
  updateOwnerAction,
} from '@/lib/owners/actions'
import { buildPersonPayload } from '@/lib/owners/api'
import type {
  OwnerBankAccount,
  OwnerFormData,
  OwnerFormErrors,
  OwnerPhone,
} from '@/lib/owners/types'
import {
  OWNER_STEP_HINTS,
  OWNER_WIZARD_DEFAULT_STEP,
  OWNER_WIZARD_STEPS,
  firstStepWithErrors,
  stepHasErrors,
} from '@/lib/owners/wizard/constants'
import {
  clearOwnerWizardDraft,
  getOwnerWizardDraft,
  saveOwnerWizardDraft,
} from '@/lib/owners/wizard/draft'
import type { OwnerWizardStepId } from '@/lib/owners/wizard/types'
import { fetchAddressByCep } from '@/lib/utils/cep/fetch-viacep'
import { onlyDigits } from '@/lib/utils/validation'
import { useToast } from '@/lib/toast/use-toast'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { WizardStepper } from '@/app/components/WizardStepper/WizardStepper'
import { WizardStepFooter } from '@/app/components/WizardStepFooter/WizardStepFooter'
import { StepBanking } from './StepBanking'
import { StepContact } from './StepContact'
import { StepAddress } from './StepAddress'
import { StepIdentification } from './StepIdentification'
import { StepPersonal } from './StepPersonal'

export interface OwnerWizardProps {
  mode?: 'create' | 'edit'
  initialData?: OwnerFormData
  ownerId?: string
}

export function CreateOwnerWizard({
  mode = 'create',
  initialData,
  ownerId,
}: OwnerWizardProps = {}) {
  const router = useRouter()
  const { toast } = useToast()
  const isEdit = mode === 'edit'

  const [step, setStep] = useState<OwnerWizardStepId>(() => {
    if (isEdit) return OWNER_WIZARD_DEFAULT_STEP
    const draft = getOwnerWizardDraft()
    return draft.step ?? OWNER_WIZARD_DEFAULT_STEP
  })

  const [data, setData] = useState<OwnerFormData>(() => {
    if (isEdit && initialData) return initialData
    const draft = getOwnerWizardDraft()
    return draft.data ?? defaultOwnerFormData()
  })

  const [errors, setErrors] = useState<OwnerFormErrors>({})
  const [warnedSteps, setWarnedSteps] = useState<Set<OwnerWizardStepId>>(
    new Set(),
  )
  const [submitting, setSubmitting] = useState(false)
  const [cepLoading, setCepLoading] = useState(false)

  const stepIndex = OWNER_WIZARD_STEPS.findIndex((s) => s.id === step)

  const stepsWithErrors = useMemo(() => {
    const set = new Set<OwnerWizardStepId>()
    for (const s of OWNER_WIZARD_STEPS) {
      if (stepHasErrors(s.id, errors)) set.add(s.id)
    }
    return set
  }, [errors])

  function goToStep(next: string) {
    const id = next as OwnerWizardStepId
    setStep(id)
    if (!isEdit) saveOwnerWizardDraft({ step: id })
  }

  function handleCancel() {
    if (!isEdit) clearOwnerWizardDraft()
    router.push('/imoveis/proprietarios')
  }

  const clearCurrentStepWarning = useCallback(
    (currentStep: OwnerWizardStepId) => {
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
      if (partial.name !== undefined) {
        next.bank_account = next.bank_account.map((acc) =>
          !acc.favored || acc.favored === prev.name
            ? { ...acc, favored: partial.name ?? '' }
            : acc,
        )
      }
      if (!isEdit) saveOwnerWizardDraft({ data: next })
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
      if (!isEdit) saveOwnerWizardDraft({ data: next })
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
      if (!isEdit) saveOwnerWizardDraft({ data: next })
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
      if (!isEdit) saveOwnerWizardDraft({ data: next })
      return next
    })
  }

  function updateBankAccount(
    id: string,
    partial: Partial<OwnerBankAccount>,
  ) {
    setData((prev) => {
      const next = {
        ...prev,
        bank_account: prev.bank_account.map((acc) => {
          if (acc.id === id) return { ...acc, ...partial }
          if (partial.main === true) return { ...acc, main: false }
          return acc
        }),
      }
      if (!isEdit) saveOwnerWizardDraft({ data: next })
      return next
    })
    setErrors((prev) => {
      const current = prev.bank_account
      if (!current?.[id]) return prev
      const next = { ...current }
      delete next[id]
      return {
        ...prev,
        bank_account: Object.keys(next).length > 0 ? next : undefined,
      }
    })
    clearCurrentStepWarning(step)
  }

  function addBankAccount() {
    setData((prev) => {
      const next = {
        ...prev,
        bank_account: [...prev.bank_account, createBankAccount(prev.name)],
      }
      if (!isEdit) saveOwnerWizardDraft({ data: next })
      return next
    })
  }

  function removeBankAccount(id: string) {
    setData((prev) => {
      const next = {
        ...prev,
        bank_account: prev.bank_account.filter((acc) => acc.id !== id),
      }
      if (!isEdit) saveOwnerWizardDraft({ data: next })
      return next
    })
  }

  function handleContinue(nextStepId: OwnerWizardStepId) {
    const allErrors = validateOwnerForm(data)
    if (stepHasErrors(step, allErrors)) {
      setWarnedSteps((prev) => new Set(prev).add(step))
    }
    goToStep(nextStepId)
  }

  async function handleFinish() {
    const nextErrors = validateOwnerForm(data)
    setErrors(nextErrors)
    setWarnedSteps(new Set())

    if (hasFormErrors(nextErrors)) {
      const target = firstStepWithErrors(nextErrors)
      if (target) goToStep(target)
      return
    }

    if (isEdit && !ownerId) {
      toast({
        title: 'Erro ao salvar',
        description:
          'Identificador do proprietário não encontrado. Volte à lista e tente novamente.',
        variant: 'error',
      })
      return
    }

    setSubmitting(true)
    if (!isEdit) {
      console.log('[cadastro proprietário] payload:', buildPersonPayload(data))
    }
    const result =
      isEdit && ownerId
        ? await updateOwnerAction(ownerId, data)
        : await createOwnerAction(data)
    setSubmitting(false)

    if (!result.success) {
      toast({
        title: isEdit
          ? 'Erro ao atualizar proprietário'
          : 'Erro ao cadastrar proprietário',
        description: result.error ?? 'Ocorreu um erro inesperado.',
        variant: 'error',
      })
      return
    }

    toast({
      title: isEdit ? 'Proprietário atualizado' : 'Proprietário cadastrado',
      description: isEdit
        ? 'As alterações foram salvas com sucesso.'
        : 'O proprietário foi criado com sucesso.',
      variant: 'success',
    })

    if (!isEdit) clearOwnerWizardDraft()
    router.push('/imoveis/proprietarios')
  }

  const footerConfig = useMemo(() => {
    const prev =
      stepIndex > 0 ? OWNER_WIZARD_STEPS[stepIndex - 1].id : null
    const next =
      stepIndex < OWNER_WIZARD_STEPS.length - 1
        ? OWNER_WIZARD_STEPS[stepIndex + 1].id
        : null

    if (step === 'banking') {
      return {
        hint: OWNER_STEP_HINTS.banking,
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
      hint: OWNER_STEP_HINTS[step],
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
          <StepIdentification data={data} errors={errors} patch={patch} />
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
      case 'banking':
        return (
          <StepBanking
            data={data}
            errors={errors}
            addBankAccount={addBankAccount}
            removeBankAccount={removeBankAccount}
            updateBankAccount={updateBankAccount}
          />
        )
      default:
        return (
          <StepIdentification data={data} errors={errors} patch={patch} />
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
          Proprietários
        </button>

        <WizardStepper
          steps={OWNER_WIZARD_STEPS}
          currentStep={step}
          onStepClick={goToStep}
          stepsWithWarnings={warnedSteps}
          stepsWithErrors={stepsWithErrors}
          ariaLabel="Etapas do proprietário"
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
