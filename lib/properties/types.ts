export type PropertyAddressFormData = {
  postal_code: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
}

export type PropertyFormData = {
  address: PropertyAddressFormData
  code: string
  status: string
  rent_price: number
  category_id: number
  subcategory_id: number
}

export type PropertyFormErrors = {
  code?: string
  status?: string
  rent_price?: string
  postal_code?: string
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
}
