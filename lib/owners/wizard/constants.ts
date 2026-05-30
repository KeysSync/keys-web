import type { OwnerFormErrors } from '../types'
import type { OwnerWizardStepId } from './types'

export const OWNER_WIZARD_STEPS: {
  id: OwnerWizardStepId
  label: string
}[] = [
  { id: 'identification', label: 'Identificação' },
  { id: 'personal', label: 'Dados pessoais' },
  { id: 'contact', label: 'Contato' },
  { id: 'address', label: 'Endereço' },
  { id: 'banking', label: 'Contas bancárias' },
]

export const OWNER_WIZARD_DEFAULT_STEP: OwnerWizardStepId = 'identification'

export const OWNER_STEP_HINTS: Record<OwnerWizardStepId, string> = {
  identification: 'Defina o tipo de pessoa e dados de identificação.',
  personal: 'Dados pessoais, documentação e estado civil.',
  contact: 'Números de telefone e observações internas.',
  address: 'Informe o CEP para preencher o endereço automaticamente.',
  banking: 'Cadastre contas para repasse e pagamentos.',
}

export function stepHasErrors(
  stepId: OwnerWizardStepId,
  errors: OwnerFormErrors,
): boolean {
  switch (stepId) {
    case 'identification':
      return Boolean(errors.type || errors.name || errors.email || errors.document)
    case 'personal':
      return Boolean(errors.birthdate || errors.marriage_regime)
    case 'contact':
      return Boolean(errors.phones && Object.keys(errors.phones).length > 0)
    case 'address':
      return Boolean(errors.postal_code || errors.street || errors.city || errors.state)
    case 'banking':
      return Boolean(errors.bank_account && Object.keys(errors.bank_account).length > 0)
    default:
      return false
  }
}

export function firstStepWithErrors(
  errors: OwnerFormErrors,
): OwnerWizardStepId | null {
  for (const step of OWNER_WIZARD_STEPS) {
    if (stepHasErrors(step.id, errors)) return step.id
  }
  return null
}
