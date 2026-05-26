export type LocatarioPapel = 'principal' | 'morador' | 'fiador'

export interface ContratoLocatarioVinculo {
  inquilinoId: string
  papel: LocatarioPapel
}

export interface ContratoLocatariosData {
  vinculos: ContratoLocatarioVinculo[]
}

export const defaultContratoLocatariosData = (): ContratoLocatariosData => ({
  vinculos: [],
})

export const LOCATARIO_PAPEL_OPTIONS: {
  value: LocatarioPapel
  label: string
}[] = [
  { value: 'principal', label: 'Locatário principal' },
  { value: 'morador', label: 'Morador' },
  { value: 'fiador', label: 'Fiador' },
]

export function getPrincipalLocatarioId(
  data: ContratoLocatariosData,
): string | null {
  return data.vinculos.find((v) => v.papel === 'principal')?.inquilinoId ?? null
}

export function isContratoLocatariosValid(data: ContratoLocatariosData): boolean {
  return getPrincipalLocatarioId(data) !== null
}
