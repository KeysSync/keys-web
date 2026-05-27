import { apiFetch } from '@/lib/api/client'
import {
  apiGetPerson,
  buildPersonPayload,
  personDtoToFormData,
  type ProprietarioWritePayload,
} from '@/lib/proprietarios/api'
import type { ProprietarioFormData } from '@/lib/proprietarios/types'
import { onlyDigits } from '@/lib/utils/validation'

export { apiGetPerson, personDtoToFormData }

export function buildInquilinoPayload(
  data: ProprietarioFormData,
): ProprietarioWritePayload {
  const payload = buildPersonPayload({ ...data, is_renter: true })
  return { ...payload, roles: ['renter'] }
}

export interface InquilinoListFilters {
  type?: 'person' | 'enterprise'
  is_renter?: boolean
  city?: string
  state?: string
  document?: string
  q?: string
}

export type InquilinoUserFilters = Pick<
  InquilinoListFilters,
  'city' | 'state' | 'document' | 'q'
>

export interface InquilinoPersonDto {
  id: string
  name?: string
  email?: string
  document?: string
  type?: 'person' | 'enterprise'
  phones?: Array<{ number?: string }>
}

export interface InquilinoListRow {
  id: string
  nome: string
  documento: string
  tipo: 'pf' | 'pj'
  email: string
  telefone: string
}

function normalizePersonsList(raw: unknown): InquilinoPersonDto[] {
  if (Array.isArray(raw)) return raw as InquilinoPersonDto[]
  if (raw && typeof raw === 'object') {
    const data = raw as { items?: InquilinoPersonDto[]; results?: InquilinoPersonDto[] }
    if (Array.isArray(data.items)) return data.items
    if (Array.isArray(data.results)) return data.results
  }
  return []
}

function buildFilterQuery(filters: InquilinoListFilters): string {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '') continue
    if (typeof value === 'boolean') {
      params.set(key, value ? 'true' : 'false')
      continue
    }
    if (key === 'document') {
      params.set(key, onlyDigits(String(value)))
      continue
    }
    params.set(key, String(value))
  }

  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export function mapInquilinoDtoToListRow(p: InquilinoPersonDto): InquilinoListRow {
  const doc = p.document ?? ''
  const digits = onlyDigits(doc)
  const tipo: InquilinoListRow['tipo'] =
    p.type === 'enterprise' || digits.length > 11 ? 'pj' : 'pf'

  return {
    id: p.id,
    nome: p.name ?? '',
    documento: doc,
    tipo,
    email: p.email ?? '',
    telefone: p.phones?.find((ph) => ph.number?.trim())?.number ?? '',
  }
}

export function apiListInquilinos(
  accessToken: string,
  filters: InquilinoListFilters,
): Promise<InquilinoPersonDto[]> {
  return apiFetch<unknown>(`/persons/v1/${buildFilterQuery(filters)}`, {
    method: 'GET',
    bearer: accessToken,
  }).then(normalizePersonsList)
}

export function apiCreateInquilino(
  accessToken: string,
  data: ProprietarioFormData,
): Promise<void> {
  return apiFetch<void>('/persons/v1/', {
    method: 'POST',
    bearer: accessToken,
    json: buildInquilinoPayload(data),
  })
}

export function apiUpdateInquilino(
  accessToken: string,
  personId: string,
  data: ProprietarioFormData,
): Promise<void> {
  return apiFetch<void>(`/persons/v1/${personId}`, {
    method: 'PUT',
    bearer: accessToken,
    json: buildInquilinoPayload(data),
  })
}

export function apiDeleteInquilino(
  accessToken: string,
  personId: string,
): Promise<void> {
  return apiFetch<void>(`/persons/v1/${personId}`, {
    method: 'DELETE',
    bearer: accessToken,
  })
}
