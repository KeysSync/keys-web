import type { ImovelFormErrors } from '../types'
import type { ImovelWizardStepId } from './types'

export const IMOVEL_WIZARD_STEPS: {
  id: ImovelWizardStepId
  label: string
}[] = [
  { id: 'identificacao', label: 'Identificação' },
  { id: 'localizacao', label: 'Localização' },
]

export const IMOVEL_WIZARD_DEFAULT_STEP: ImovelWizardStepId = 'identificacao'

export const IMOVEL_STEP_HINTS: Record<ImovelWizardStepId, string> = {
  identificacao: 'Código, status e valor do aluguel do imóvel.',
  localizacao: 'Informe o CEP para preencher o endereço automaticamente.',
}

export function imovelStepHasErrors(
  stepId: ImovelWizardStepId,
  errors: ImovelFormErrors,
): boolean {
  switch (stepId) {
    case 'identificacao':
      return Boolean(errors.code || errors.status || errors.rent_price)
    case 'localizacao':
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

export function firstImovelStepWithErrors(
  errors: ImovelFormErrors,
): ImovelWizardStepId | null {
  for (const step of IMOVEL_WIZARD_STEPS) {
    if (imovelStepHasErrors(step.id, errors)) return step.id
  }
  return null
}
