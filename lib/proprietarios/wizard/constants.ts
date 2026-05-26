import type { ProprietarioFormErrors } from '../types'
import type { ProprietarioWizardStepId } from './types'

export const PROPRIETARIO_WIZARD_STEPS: {
  id: ProprietarioWizardStepId
  label: string
}[] = [
  { id: 'identificacao', label: 'Identificação' },
  { id: 'pessoal', label: 'Dados pessoais' },
  { id: 'contato', label: 'Contato' },
  { id: 'endereco', label: 'Endereço' },
  { id: 'bancario', label: 'Contas bancárias' },
]

export const PROPRIETARIO_WIZARD_DEFAULT_STEP: ProprietarioWizardStepId = 'identificacao'

export const PROPRIETARIO_STEP_HINTS: Record<ProprietarioWizardStepId, string> = {
  identificacao: 'Defina o tipo de pessoa e dados de identificação.',
  pessoal: 'Dados pessoais, documentação e estado civil.',
  contato: 'Números de telefone e observações internas.',
  endereco: 'Informe o CEP para preencher o endereço automaticamente.',
  bancario: 'Cadastre contas para repasse e pagamentos.',
}

export function stepHasErrors(
  stepId: ProprietarioWizardStepId,
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
    case 'bancario':
      return Boolean(errors.bank_account && Object.keys(errors.bank_account).length > 0)
    default:
      return false
  }
}

export function firstStepWithErrors(
  errors: ProprietarioFormErrors,
): ProprietarioWizardStepId | null {
  for (const step of PROPRIETARIO_WIZARD_STEPS) {
    if (stepHasErrors(step.id, errors)) return step.id
  }
  return null
}
