import type { PropertyFormErrors } from '../types'
import type { PropertyWizardStepId } from './types'

export const PROPERTY_WIZARD_STEPS: {
  id: PropertyWizardStepId
  label: string
}[] = [
  { id: 'identification', label: 'Identificação' },
  { id: 'location', label: 'Localização' },
]

export const PROPERTY_WIZARD_DEFAULT_STEP: PropertyWizardStepId = 'identification'

export const PROPERTY_STEP_HINTS: Record<PropertyWizardStepId, string> = {
  identification: 'Código, status e valor do aluguel do imóvel.',
  location: 'Informe o CEP para preencher o endereço automaticamente.',
}

export function propertyStepHasErrors(
  stepId: PropertyWizardStepId,
  errors: PropertyFormErrors,
): boolean {
  switch (stepId) {
    case 'identification':
      return Boolean(errors.code || errors.status || errors.rent_price)
    case 'location':
      return Boolean(
        errors.postal_code ||
          errors.street ||
          errors.number ||
          errors.complement ||
          errors.neighborhood ||
          errors.city ||
          errors.state,
      )
    default:
      return false
  }
}

export function firstPropertyStepWithErrors(
  errors: PropertyFormErrors,
): PropertyWizardStepId | null {
  for (const step of PROPERTY_WIZARD_STEPS) {
    if (propertyStepHasErrors(step.id, errors)) return step.id
  }
  return null
}
