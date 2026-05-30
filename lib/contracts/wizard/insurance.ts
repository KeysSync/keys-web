export type InsurancePayer = 'landlord' | 'tenant' | 'agency'

export type InsuranceType =
  | 'fire'
  | 'rentGuarantee'
  | 'civilLiability'
  | 'contents'
  | 'multiRisk'
  | 'life'
  | 'electricalDamage'
  | 'other'

export interface ContractInsuranceItem {
  id: string
  type: InsuranceType
  insurer: string
  policyNumber: string
  coverageAmount: number | ''
  monthlyPremium: number | ''
  validFrom: string
  validUntil: string
  payer: InsurancePayer
  notes: string
}

/** Formato antigo do draft (apenas incêndio). */
export interface ContractInsuranceLegacyData {
  contracted: boolean
  insurer: string
  policyNumber: string
  coverageAmount: number | ''
  validFrom: string
  validUntil: string
  monthlyPremium: number | ''
  payer: InsurancePayer
  notes: string
}

export interface ContractInsurancesData {
  activeTypeMenu: InsuranceType
  items: ContractInsuranceItem[]
  /** rascunho do formulário do submenu ativo */
  draft: Omit<ContractInsuranceItem, 'id' | 'type'>
}

export const INSURANCE_TYPE_OPTIONS: {
  value: InsuranceType
  label: string
  description: string
}[] = [
  {
    value: 'fire',
    label: 'Incêndio',
    description: 'Cobertura contra incêndio, explosão e fumaça no imóvel.',
  },
  {
    value: 'rentGuarantee',
    label: 'Fiança locatícia',
    description: 'Apólice que garante o pagamento do aluguel ao proprietário.',
  },
  {
    value: 'civilLiability',
    label: 'Resp. civil',
    description: 'Danos causados a terceiros no uso do imóvel.',
  },
  {
    value: 'contents',
    label: 'Conteúdo',
    description: 'Bens e pertences do locatário dentro do imóvel.',
  },
  {
    value: 'multiRisk',
    label: 'Multirrisco',
    description: 'Pacote combinado para o imóvel (incêndio, danos elétricos, etc.).',
  },
  {
    value: 'life',
    label: 'Vida',
    description: 'Seguro de vida vinculado à locação, quando exigido.',
  },
  {
    value: 'electricalDamage',
    label: 'Danos elétricos',
    description: 'Queima de equipamentos por variação de energia.',
  },
  {
    value: 'other',
    label: 'Outro',
    description: 'Demais modalidades não listadas acima.',
  },
]

export const INSURANCE_PAYER_OPTIONS: {
  value: InsurancePayer
  label: string
}[] = [
  { value: 'tenant', label: 'Locatário' },
  { value: 'landlord', label: 'Proprietário' },
  { value: 'agency', label: 'Imobiliária' },
]

const emptyInsuranceDraft = (): ContractInsurancesData['draft'] => ({
  insurer: '',
  policyNumber: '',
  coverageAmount: '',
  monthlyPremium: '',
  validFrom: '',
  validUntil: '',
  payer: 'tenant',
  notes: '',
})

export const defaultContractInsurancesData = (): ContractInsurancesData => ({
  activeTypeMenu: 'fire',
  items: [],
  draft: emptyInsuranceDraft(),
})

/** Compatível com draft antigo (único seguro incêndio). */
export function normalizeContractInsurancesData(
  raw:
    | Partial<ContractInsurancesData>
    | Partial<ContractInsuranceLegacyData>
    | undefined,
): ContractInsurancesData {
  const base = defaultContractInsurancesData()
  if (!raw) return base

  if ('items' in raw && Array.isArray(raw.items)) {
    return {
      ...base,
      ...raw,
      items: raw.items,
      draft: { ...emptyInsuranceDraft(), ...raw.draft },
    }
  }

  const legacy = raw as Partial<ContractInsuranceLegacyData>
  if (legacy.contracted === false) return base

  if (
    legacy.insurer ||
    legacy.policyNumber ||
    legacy.coverageAmount ||
    legacy.monthlyPremium
  ) {
    return {
      activeTypeMenu: 'fire',
      items: [
        {
          id: `sg-legacy-${Date.now()}`,
          type: 'fire',
          insurer: legacy.insurer ?? '',
          policyNumber: legacy.policyNumber ?? '',
          coverageAmount: legacy.coverageAmount ?? '',
          monthlyPremium: legacy.monthlyPremium ?? '',
          validFrom: legacy.validFrom ?? '',
          validUntil: legacy.validUntil ?? '',
          payer: legacy.payer ?? 'tenant',
          notes: legacy.notes ?? '',
        },
      ],
      draft: emptyInsuranceDraft(),
    }
  }

  return base
}

export function createInsuranceItem(
  type: InsuranceType,
  draft: ContractInsurancesData['draft'],
): ContractInsuranceItem {
  return {
    id: `sg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    ...draft,
  }
}

export function getInsuranceTypeLabel(type: InsuranceType) {
  return INSURANCE_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type
}

/** Alias para compatibilidade com imports existentes. */
export const defaultContractInsuranceData = defaultContractInsurancesData
export type ContractInsuranceData = ContractInsurancesData
