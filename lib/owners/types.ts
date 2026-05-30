export type OwnerType = "person" | "enterprise";

/** Para listagens (mantém compat com cadastros de pessoas física/jurídica na UI). */
export type OwnerListType = "pf" | "pj";

export type OwnerListRow = {
  id: string;
  name: string;
  document: string;
  type: OwnerListType;
  email: string;
  phone: string;
  propertiesCount: number;
};

export type MarriageRegime =
  | "Comunhão parcial de bens"
  | "Comunhão total de bens"
  | "Separação parcial de bens"
  | "Separação total de bens"
  | "Contract pré-nupcial";

export type PixType = "CPF/CNPJ" | "E-mail" | "Celular" | "Aleatória";

export type BankAccountType = "Corrente" | "Poupança";

export type OwnerPhone = {
  id: string;
  number: string;
  obs: string;
};

export type OwnerBankAccount = {
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

export type OwnerFormData = {
  name: string;
  email: string;
  document: string;
  type: OwnerType;
  is_renter: boolean;
  rg: string;
  rg_origin: string;
  phones: OwnerPhone[];
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
  bank_account: OwnerBankAccount[];
};

export type OwnerFormErrors = {
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
  phones?: Record<
    string,
    Partial<Record<keyof OwnerPhone, string>>
  >;
  bank_account?: Record<
    string,
    Partial<Record<keyof OwnerBankAccount, string>>
  >;
};
