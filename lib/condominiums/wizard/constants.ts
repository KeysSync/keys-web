import type { CondominiumFormErrors } from '../types'
import type { CondominiumWizardStepId } from './types'

export const CONDOMINIUM_WIZARD_STEPS: {
  id: CondominiumWizardStepId
  label: string
}[] = [
  { id: 'identification', label: 'Identificação' },
  { id: 'address', label: 'Endereço' },
]

export const CONDOMINIUM_WIZARD_DEFAULT_STEP: CondominiumWizardStepId =
  'identification'

export const CONDOMINIUM_STEP_HINTS: Record<CondominiumWizardStepId, string> = {
  identification: 'Código, nome e observações do condomínio.',
  address: 'Informe o CEP para preencher o endereço automaticamente.',
}

export function condominiumStepHasErrors(
  stepId: CondominiumWizardStepId,
  errors: CondominiumFormErrors,
): boolean {
  switch (stepId) {
    case 'identification':
      return Boolean(errors.code || errors.name)
    case 'address':
      return Boolean(
        errors.postal_code ||
          errors.street ||
          errors.city ||
          errors.state,
      )
    default:
      return false
  }
}

export function firstCondominiumStepWithErrors(
  errors: CondominiumFormErrors,
): CondominiumWizardStepId | null {
  for (const step of CONDOMINIUM_WIZARD_STEPS) {
    if (condominiumStepHasErrors(step.id, errors)) return step.id
  }
  return null
}
