import type { CondominiumFormErrors } from '../types'
import type { CondominiumWizardStepId } from './types'

export const CONDOMINIUM_WIZARD_STEPS: {
  id: CondominiumWizardStepId
  label: string
}[] = [
  { id: 'identificacao', label: 'Identificação' },
  { id: 'endereco', label: 'Endereço' },
]

export const CONDOMINIUM_WIZARD_DEFAULT_STEP: CondominiumWizardStepId =
  'identificacao'

export const CONDOMINIUM_STEP_HINTS: Record<CondominiumWizardStepId, string> = {
  identificacao: 'Código, nome e observações do condomínio.',
  endereco: 'Informe o CEP para preencher o endereço automaticamente.',
}

export function condominiumStepHasErrors(
  stepId: CondominiumWizardStepId,
  errors: CondominiumFormErrors,
): boolean {
  switch (stepId) {
    case 'identificacao':
      return Boolean(errors.code || errors.name)
    case 'endereco':
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
