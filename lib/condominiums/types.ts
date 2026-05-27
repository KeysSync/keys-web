export type CondominiumAddressFormData = {
  postal_code: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
}

export type CondominiumFormData = {
  code: string
  name: string
  obs: string
  address: CondominiumAddressFormData
}

export type CondominiumFormErrors = {
  code?: string
  name?: string
  obs?: string
  postal_code?: string
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
}
