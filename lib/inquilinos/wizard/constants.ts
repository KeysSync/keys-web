import type { ProprietarioFormErrors } from '@/lib/proprietarios/types'
import type { InquilinoWizardStepId } from './types'

export const INQUILINO_WIZARD_STEPS: {
  id: InquilinoWizardStepId
  label: string
}[] = [
  { id: 'identificacao', label: 'Identificação' },
  { id: 'pessoal', label: 'Dados pessoais' },
  { id: 'contato', label: 'Contato' },
  { id: 'endereco', label: 'Endereço' },
]

export const INQUILINO_WIZARD_DEFAULT_STEP: InquilinoWizardStepId = 'identificacao'

export const INQUILINO_STEP_HINTS: Record<InquilinoWizardStepId, string> = {
  identificacao: 'Defina o tipo de pessoa e dados de identificação.',
  pessoal: 'Dados pessoais, documentação e estado civil.',
  contato: 'Números de telefone e observações internas.',
  endereco: 'Informe o CEP para preencher o endereço automaticamente.',
}

export function inquilinoStepHasErrors(
  stepId: InquilinoWizardStepId,
  errors: ProprietarioFormErrors,
): boolean {
  switch (stepId) {
    case 'identificacao':
      return Boolean(errors.type || errors.name || errors.email || errors.document)
    case 'pessoal':
      return Boolean(errors.birthdate || errors.marriage_regime)
    case 'contato':
      return Boolean(errors.telefones && Object.keys(errors.telefones).length > 0)
    case 'endereco':
      return Boolean(errors.postal_code || errors.street || errors.city || errors.state)
    default:
      return false
  }
}

export function firstInquilinoStepWithErrors(
  errors: ProprietarioFormErrors,
): InquilinoWizardStepId | null {
  for (const step of INQUILINO_WIZARD_STEPS) {
    if (inquilinoStepHasErrors(step.id, errors)) return step.id
  }
  return null
}
