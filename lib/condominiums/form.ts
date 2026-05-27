import { validateCep, validateRequired } from '@/lib/utils/validation'
import type { CondominiumFormData, CondominiumFormErrors } from './types'

export function defaultCondominiumFormData(): CondominiumFormData {
  return {
    code: '',
    name: '',
    obs: '',
    address: {
      postal_code: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    },
  }
}

export function validateCondominiumForm(
  data: CondominiumFormData,
): CondominiumFormErrors {
  const errors: CondominiumFormErrors = {}

  const code = validateRequired(data.code, 'Código')
  if (!code.valid) errors.code = code.message

  const name = validateRequired(data.name, 'Nome')
  if (!name.valid) errors.name = name.message

  const cep = validateCep(data.address.postal_code)
  if (!cep.valid) errors.postal_code = cep.message

  const street = validateRequired(data.address.street, 'Logradouro')
  if (!street.valid) errors.street = street.message

  const city = validateRequired(data.address.city, 'Cidade')
  if (!city.valid) errors.city = city.message

  const state = validateRequired(data.address.state, 'Estado')
  if (!state.valid) errors.state = state.message

  return errors
}

export function hasCondominiumFormErrors(errors: CondominiumFormErrors): boolean {
  return Object.values(errors).some(Boolean)
}
