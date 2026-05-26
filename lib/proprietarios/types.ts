export type ProprietarioType = "person" | "enterprise";

export type MarriageRegime =
  | "Comunhão parcial de bens"
  | "Comunhão total de bens"
  | "Separação parcial de bens"
  | "Separação total de bens"
  | "Contrato pré-nupcial";

export type PixType = "CPF/CNPJ" | "E-mail" | "Celular" | "Aleatória";

export type BankAccountType = "Corrente" | "Poupança";

export type ProprietarioTelefone = {
  id: string;
  number: string;
  obs: string;
};

export type ProprietarioBankAccount = {
  id: string;
  type: BankAccountType | "";
  bank_id: string;
  agency: string;
  account: string;
  document: string;
  favored: string;
  pix_type: PixType | "";
  pix_key: string;
  main: boolean;
};

export type ProprietarioFormData = {
  name: string;
  email: string;
  document: string;
  type: ProprietarioType;
  rg: string;
  rg_origin: string;
  telefones: ProprietarioTelefone[];
  birthdate: string;
  nationality: string;
  place_of_birth: string;
  civil_status: string;
  marriage_regime: MarriageRegime | "";
  occupation: string;
  partner: string;
  postal_code: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  bank_account: ProprietarioBankAccount[];
};

export type ProprietarioFormErrors = {
  name?: string;
  email?: string;
  document?: string;
  type?: string;
  birthdate?: string;
  postal_code?: string;
  street?: string;
  city?: string;
  state?: string;
  marriage_regime?: string;
  telefones?: Record<
    string,
    Partial<Record<keyof ProprietarioTelefone, string>>
  >;
  bank_account?: Record<
    string,
    Partial<Record<keyof ProprietarioBankAccount, string>>
  >;
};
