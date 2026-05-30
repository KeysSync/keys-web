/** Tenant da organização (multi-tenant no header), distinto de locatário de contrato. */
export type OrganizationTenant = {
  id: string
  name: string
  initials: string
  brandColor: string
  imageUrl?: string
}
