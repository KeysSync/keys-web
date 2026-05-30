import type { OwnerFormErrors } from '@/lib/owners/types'
import type { TenantWizardStepId } from './types'

export const TENANT_WIZARD_STEPS: {
  id: TenantWizardStepId
  label: string
}[] = [
  { id: 'identification', label: 'Identificação' },
  { id: 'personal', label: 'Dados pessoais' },
  { id: 'contact', label: 'Contato' },
  { id: 'address', label: 'Endereço' },
]

export const TENANT_WIZARD_DEFAULT_STEP: TenantWizardStepId = 'identification'

export const TENANT_STEP_HINTS: Record<TenantWizardStepId, string> = {
  identification: 'Defina o tipo de pessoa e dados de identificação.',
  personal: 'Dados pessoais, documentação e estado civil.',
  contact: 'Números de telefone e observações internas.',
  address: 'Informe o CEP para preencher o endereço automaticamente.',
}

export function tenantStepHasErrors(
  stepId: TenantWizardStepId,
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
    default:
      return false
  }
}

export function firstTenantStepWithErrors(
  errors: OwnerFormErrors,
): TenantWizardStepId | null {
  for (const step of TENANT_WIZARD_STEPS) {
    if (tenantStepHasErrors(step.id, errors)) return step.id
  }
  return null
}
