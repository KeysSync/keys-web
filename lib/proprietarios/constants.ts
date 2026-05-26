import type { MarriageRegime, PixType } from "./types";

export const PROPRIETARIO_TYPE_OPTIONS = [
  { value: "person", label: "Pessoa física" },
  { value: "enterprise", label: "Pessoa jurídica" },
] as const;

export const CIVIL_STATUS_OPTIONS = [
  { value: "solteiro", label: "Solteiro(a)" },
  { value: "casado", label: "Casado(a)" },
  { value: "uniao_estavel", label: "União estável" },
  { value: "divorciado", label: "Divorciado(a)" },
  { value: "viuvo", label: "Viúvo(a)" },
  { value: "separado", label: "Separado(a)" },
] as const;

export const MARRIAGE_REGIME_OPTIONS: { value: MarriageRegime; label: string }[] =
  [
    { value: "Comunhão parcial de bens", label: "Comunhão parcial de bens" },
    { value: "Comunhão total de bens", label: "Comunhão total de bens" },
    {
      value: "Separação parcial de bens",
      label: "Separação parcial de bens",
    },
    { value: "Separação total de bens", label: "Separação total de bens" },
    { value: "Contrato pré-nupcial", label: "Contrato pré-nupcial" },
  ];

export const BANK_ACCOUNT_TYPE_OPTIONS = [
  { value: "Corrente", label: "Corrente" },
  { value: "Poupança", label: "Poupança" },
] as const;

export const PIX_TYPE_OPTIONS: { value: PixType; label: string }[] = [
  { value: "CPF/CNPJ", label: "CPF/CNPJ" },
  { value: "E-mail", label: "E-mail" },
  { value: "Celular", label: "Celular" },
  { value: "Aleatória", label: "Aleatória" },
];

export const BRAZIL_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

export const STATE_OPTIONS = BRAZIL_STATES.map((uf) => ({
  value: uf,
  label: uf,
}));

/** Status civis que exibem regime de casamento e cônjuge */
export const CIVIL_STATUS_WITH_PARTNER = new Set([
  "casado",
  "uniao_estavel",
]);
