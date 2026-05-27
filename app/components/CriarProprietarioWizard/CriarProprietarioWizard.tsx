'use client'

import {
  createBankAccount,
  createTelefone,
  defaultProprietarioFormData,
  hasFormErrors,
  validateProprietarioForm,
} from '@/lib/proprietarios/form'
import {
  createProprietarioAction,
  updateProprietarioAction,
} from '@/lib/proprietarios/actions'
import type {
  ProprietarioBankAccount,
  ProprietarioFormData,
  ProprietarioFormErrors,
  ProprietarioTelefone,
} from '@/lib/proprietarios/types'
import {
  PROPRIETARIO_STEP_HINTS,
  PROPRIETARIO_WIZARD_DEFAULT_STEP,
  PROPRIETARIO_WIZARD_STEPS,
  firstStepWithErrors,
  stepHasErrors,
} from '@/lib/proprietarios/wizard/constants'
import {
  clearProprietarioWizardDraft,
  getProprietarioWizardDraft,
  saveProprietarioWizardDraft,
} from '@/lib/proprietarios/wizard/draft'
import type { ProprietarioWizardStepId } from '@/lib/proprietarios/wizard/types'
import { fetchAddressByCep } from '@/lib/utils/cep/fetch-viacep'
import { onlyDigits } from '@/lib/utils/validation'
import { useToast } from '@/lib/toast/use-toast'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { WizardStepper } from '@/app/components/WizardStepper/WizardStepper'
import { WizardStepFooter } from '@/app/components/WizardStepFooter/WizardStepFooter'
import { StepBancario } from './StepBancario'
import { StepContato } from './StepContato'
import { StepEndereco } from './StepEndereco'
import { StepIdentificacao } from './StepIdentificacao'
import { StepPessoal } from './StepPessoal'

export interface ProprietarioWizardProps {
  mode?: 'create' | 'edit'
  initialData?: ProprietarioFormData
  proprietarioId?: string
}

export function CriarProprietarioWizard({
  mode = 'create',
  initialData,
  proprietarioId,
}: ProprietarioWizardProps = {}) {
  const router = useRouter()
  const { toast } = useToast()
  const isEdit = mode === 'edit'

  const [step, setStep] = useState<ProprietarioWizardStepId>(() => {
    if (isEdit) return PROPRIETARIO_WIZARD_DEFAULT_STEP
    const draft = getProprietarioWizardDraft()
    return draft.step ?? PROPRIETARIO_WIZARD_DEFAULT_STEP
  })

  const [data, setData] = useState<ProprietarioFormData>(() => {
    if (isEdit && initialData) return initialData
    const draft = getProprietarioWizardDraft()
    return draft.data ?? defaultProprietarioFormData()
  })

  const [errors, setErrors] = useState<ProprietarioFormErrors>({})
  const [warnedSteps, setWarnedSteps] = useState<Set<ProprietarioWizardStepId>>(
    new Set(),
  )
  const [submitting, setSubmitting] = useState(false)
  const [cepLoading, setCepLoading] = useState(false)

  const stepIndex = PROPRIETARIO_WIZARD_STEPS.findIndex((s) => s.id === step)

  const stepsWithErrors = useMemo(() => {
    const set = new Set<ProprietarioWizardStepId>()
    for (const s of PROPRIETARIO_WIZARD_STEPS) {
      if (stepHasErrors(s.id, errors)) set.add(s.id)
    }
    return set
  }, [errors])

  function goToStep(next: string) {
    const id = next as ProprietarioWizardStepId
    setStep(id)
    if (!isEdit) saveProprietarioWizardDraft({ step: id })
  }

  function handleCancel() {
    if (!isEdit) clearProprietarioWizardDraft()
    router.push('/imoveis/proprietarios')
  }

  const clearCurrentStepWarning = useCallback(
    (currentStep: ProprietarioWizardStepId) => {
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
      if (partial.name !== undefined) {
        next.bank_account = next.bank_account.map((acc) =>
          !acc.favored || acc.favored === prev.name
            ? { ...acc, favored: partial.name ?? '' }
            : acc,
        )
      }
      if (!isEdit) saveProprietarioWizardDraft({ data: next })
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
      if (!isEdit) saveProprietarioWizardDraft({ data: next })
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
      if (!isEdit) saveProprietarioWizardDraft({ data: next })
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
      if (!isEdit) saveProprietarioWizardDraft({ data: next })
      return next
    })
  }

  function updateBankAccount(
    id: string,
    partial: Partial<ProprietarioBankAccount>,
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
      if (!isEdit) saveProprietarioWizardDraft({ data: next })
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
      if (!isEdit) saveProprietarioWizardDraft({ data: next })
      return next
    })
  }

  function removeBankAccount(id: string) {
    setData((prev) => {
      const next = {
        ...prev,
        bank_account: prev.bank_account.filter((acc) => acc.id !== id),
      }
      if (!isEdit) saveProprietarioWizardDraft({ data: next })
      return next
    })
  }

  function handleContinue(nextStepId: ProprietarioWizardStepId) {
    const allErrors = validateProprietarioForm(data)
    if (stepHasErrors(step, allErrors)) {
      setWarnedSteps((prev) => new Set(prev).add(step))
    }
    goToStep(nextStepId)
  }

  async function handleFinish() {
    const nextErrors = validateProprietarioForm(data)
    setErrors(nextErrors)
    setWarnedSteps(new Set())

    if (hasFormErrors(nextErrors)) {
      const target = firstStepWithErrors(nextErrors)
      if (target) goToStep(target)
      return
    }

    if (isEdit && !proprietarioId) {
      toast({
        title: 'Erro ao salvar',
        description:
          'Identificador do proprietário não encontrado. Volte à lista e tente novamente.',
        variant: 'error',
      })
      return
    }

    setSubmitting(true)
    const result =
      isEdit && proprietarioId
        ? await updateProprietarioAction(proprietarioId, data)
        : await createProprietarioAction(data)
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

    if (!isEdit) clearProprietarioWizardDraft()
    router.push('/imoveis/proprietarios')
  }

  const footerConfig = useMemo(() => {
    const prev =
      stepIndex > 0 ? PROPRIETARIO_WIZARD_STEPS[stepIndex - 1].id : null
    const next =
      stepIndex < PROPRIETARIO_WIZARD_STEPS.length - 1
        ? PROPRIETARIO_WIZARD_STEPS[stepIndex + 1].id
        : null

    if (step === 'bancario') {
      return {
        hint: PROPRIETARIO_STEP_HINTS.bancario,
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
      hint: PROPRIETARIO_STEP_HINTS[step],
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
      case 'bancario':
        return (
          <StepBancario
            data={data}
            errors={errors}
            addBankAccount={addBankAccount}
            removeBankAccount={removeBankAccount}
            updateBankAccount={updateBankAccount}
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
          Proprietários
        </button>

        <WizardStepper
          steps={PROPRIETARIO_WIZARD_STEPS}
          currentStep={step}
          onStepClick={goToStep}
          stepsWithWarnings={warnedSteps}
          stepsWithErrors={stepsWithErrors}
          ariaLabel="Etapas do proprietário"
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
