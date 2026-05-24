export type TipoGarantia =
  | 'sem_garantia'
  | 'fiador'
  | 'caucao'
  | 'seguro_fianca'
  | 'titulo_capitalizacao'

export interface ContratoGarantiaData {
  tipo: TipoGarantia
  valor: number | ''
  fiadorNome: string
  fiadorDocumento: string
  vigenciaInicio: string
  vigenciaFim: string
  observacoes: string
}

export const defaultContratoGarantiaData = (): ContratoGarantiaData => ({
  tipo: 'sem_garantia',
  valor: '',
  fiadorNome: '',
  fiadorDocumento: '',
  vigenciaInicio: '',
  vigenciaFim: '',
  observacoes: '',
})

export const TIPO_GARANTIA_OPTIONS: { value: TipoGarantia; label: string }[] = [
  { value: 'sem_garantia', label: 'Sem garantia' },
  { value: 'fiador', label: 'Fiador' },
  { value: 'caucao', label: 'Caução' },
  { value: 'seguro_fianca', label: 'Seguro fiança' },
  { value: 'titulo_capitalizacao', label: 'Título de capitalização' },
]
