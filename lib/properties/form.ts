import { validateCep, validateRequired } from '@/lib/utils/validation'
import type { PropertyFormData, PropertyFormErrors } from './types'

export function defaultPropertyFormData(): PropertyFormData {
  return {
    address: {
      postal_code: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    },
    code: '',
    status: 'available',
    rent_price: 0,
    category_id: 0,
    subcategory_id: 0,
  }
}

export function validatePropertyForm(data: PropertyFormData): PropertyFormErrors {
  const errors: PropertyFormErrors = {}

  const code = validateRequired(data.code, 'Código')
  if (!code.valid) errors.code = code.message

  const cep = validateCep(data.address.postal_code)
  if (!cep.valid) errors.postal_code = cep.message

  const street = validateRequired(data.address.street, 'Endereço')
  if (!street.valid) errors.street = street.message

  const number = validateRequired(data.address.number, 'Número')
  if (!number.valid) errors.number = number.message

  const neighborhood = validateRequired(data.address.neighborhood, 'Bairro')
  if (!neighborhood.valid) errors.neighborhood = neighborhood.message

  const city = validateRequired(data.address.city, 'Cidade')
  if (!city.valid) errors.city = city.message

  const state = validateRequired(data.address.state, 'Estado')
  if (!state.valid) errors.state = state.message

  return errors
}

export function hasPropertyFormErrors(errors: PropertyFormErrors): boolean {
  return Object.values(errors).some(Boolean)
}
