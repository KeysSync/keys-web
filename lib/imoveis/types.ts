export type ImovelAddressFormData = {
  postal_code: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
}

export type ImovelFormData = {
  address: ImovelAddressFormData
  code: string
  status: string
  rent_price: number
  category_id: number
  subcategory_id: number
}

export type ImovelFormErrors = {
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
