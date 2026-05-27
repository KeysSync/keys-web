import { apiFetch } from "@/lib/api/client";
import { createBankAccount, createTelefone } from "@/lib/proprietarios/form";
import type {
  BankAccountType,
  MarriageRegime,
  PixType,
  ProprietarioFormData,
  ProprietarioListRow,
} from "@/lib/proprietarios/types";
import { onlyDigits } from "@/lib/utils/validation";

type PersonRole = "owner" | "renter";
type BankAccountTypeApi = "checking" | "savings";
type PixTypeApi = "document" | "email" | "phone" | "random";
type MarriageRegimeApi =
  | "partial_community"
  | "total_community"
  | "partial_separation"
  | "total_separation"
  | "prenuptial_agreement";

export interface PersonDto {
  id: string;
  name?: string;
  email?: string;
  document?: string;
  type?: "person" | "enterprise";
  roles?: PersonRole[];
  rg?: string;
  rg_origin?: string;
  birthdate?: string | null;
  nationality?: string;
  place_of_birth?: string;
  civil_status?: string;
  marriage_regime?: MarriageRegimeApi | string;
  occupation?: string;
  partner_id?: string | null;
  address?: {
    postal_code?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  } | null;
  phones?: Array<{ number?: string; obs?: string }>;
  bank_accounts?: Array<{
    type?: BankAccountTypeApi;
    bank_id?: number;
    agency?: string;
    account?: string;
    document?: string;
    favored?: string;
    pix_type?: PixTypeApi;
    pix_key?: string;
    main?: boolean;
  }>;
  properties_count?: number;
  qtd_imoveis?: number;
}

interface ProprietarioWritePayload {
  name: string;
  email: string;
  document: string;
  type: "person" | "enterprise";
  roles: PersonRole[];
  rg: string;
  rg_origin: string;
  birthdate: string;
  nationality: string;
  place_of_birth: string;
  civil_status: string;
  marriage_regime?: MarriageRegimeApi;
  occupation: string;
  partner_id?: string;
  address: {
    postal_code: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  phones: Array<{
    number: string;
    obs: string;
  }>;
  bank_accounts: Array<{
    type: BankAccountTypeApi;
    bank_id: number;
    agency: string;
    account: string;
    document: string;
    favored: string;
    pix_type?: PixTypeApi;
    pix_key: string;
    main: boolean;
  }>;
}

const MARRIAGE_REGIME_MAP: Record<string, MarriageRegimeApi> = {
  "Comunhão parcial de bens": "partial_community",
  "Comunhão total de bens": "total_community",
  "Separação parcial de bens": "partial_separation",
  "Separação total de bens": "total_separation",
  "Contrato pré-nupcial": "prenuptial_agreement",
};

const MARRIAGE_REGIME_REVERSE: Record<MarriageRegimeApi, MarriageRegime> = {
  partial_community: "Comunhão parcial de bens",
  total_community: "Comunhão total de bens",
  partial_separation: "Separação parcial de bens",
  total_separation: "Separação total de bens",
  prenuptial_agreement: "Contrato pré-nupcial",
};

const MARRIAGE_LABELS = new Set<string>([
  "Comunhão parcial de bens",
  "Comunhão total de bens",
  "Separação parcial de bens",
  "Separação total de bens",
  "Contrato pré-nupcial",
]);

const BANK_ACCOUNT_TYPE_MAP: Record<string, BankAccountTypeApi> = {
  Corrente: "checking",
  Poupança: "savings",
};

const BANK_ACCOUNT_TYPE_REVERSE: Record<BankAccountTypeApi, BankAccountType> = {
  checking: "Corrente",
  savings: "Poupança",
};

const PIX_TYPE_MAP: Record<string, PixTypeApi> = {
  "CPF/CNPJ": "document",
  "E-mail": "email",
  Celular: "phone",
  Aleatória: "random",
};

const PIX_TYPE_REVERSE: Record<PixTypeApi, PixType> = {
  document: "CPF/CNPJ",
  email: "E-mail",
  phone: "Celular",
  random: "Aleatória",
};

function normalizePersonsList(raw: unknown): PersonDto[] {
  if (Array.isArray(raw)) {
    return raw as PersonDto[];
  }
  if (raw && typeof raw === "object") {
    const o = raw as { items?: PersonDto[]; results?: PersonDto[] };
    if (Array.isArray(o.items)) return o.items;
    if (Array.isArray(o.results)) return o.results;
  }
  return [];
}

function parseMarriageRegimeFromApi(
  raw: string | undefined | null,
): MarriageRegime | "" {
  if (!raw) return "";
  if (raw in MARRIAGE_REGIME_REVERSE) {
    return MARRIAGE_REGIME_REVERSE[raw as MarriageRegimeApi];
  }
  if (MARRIAGE_LABELS.has(raw)) {
    return raw as MarriageRegime;
  }
  return "";
}

function buildPersonPayload(data: ProprietarioFormData): ProprietarioWritePayload {
  const bankAccounts = data.bank_account
    .filter((acc) => acc.type && acc.bank_id)
    .map((acc) => ({
      type: BANK_ACCOUNT_TYPE_MAP[acc.type],
      bank_id: Number.parseInt(acc.bank_id, 10),
      agency: acc.agency.trim(),
      account: acc.account.trim(),
      document: onlyDigits(acc.document),
      favored: acc.favored.trim(),
      pix_type: acc.pix_type ? PIX_TYPE_MAP[acc.pix_type] : undefined,
      pix_key: acc.pix_key.trim(),
      main: acc.main,
    }));

  const payload: ProprietarioWritePayload = {
    name: data.name.trim(),
    email: data.email.trim(),
    document: onlyDigits(data.document),
    type: data.type,
    roles: data.is_renter ? ["owner", "renter"] : ["owner"],
    rg: data.rg.trim(),
    rg_origin: data.rg_origin.trim(),
    birthdate: data.birthdate,
    nationality: data.nationality.trim(),
    place_of_birth: data.place_of_birth.trim(),
    civil_status: data.civil_status,
    occupation: data.occupation.trim(),
    address: {
      postal_code: onlyDigits(data.postal_code),
      street: data.street.trim(),
      number: data.number.trim(),
      complement: data.complement.trim(),
      neighborhood: data.neighborhood.trim(),
      city: data.city.trim(),
      state: data.state.trim(),
    },
    phones: data.telefones.map((tel) => ({
      number: onlyDigits(tel.number),
      obs: tel.obs.trim(),
    })),
    bank_accounts: bankAccounts,
  };

  if (data.marriage_regime) {
    payload.marriage_regime = MARRIAGE_REGIME_MAP[data.marriage_regime];
  }

  if (data.partner) {
    payload.partner_id = data.partner;
  }

  return payload;
}

export function mapPersonDtoToListRow(p: PersonDto): ProprietarioListRow {
  const doc = p.document ?? "";
  const digits = onlyDigits(doc);
  const tipo: ProprietarioListRow["tipo"] =
    p.type === "enterprise" || digits.length > 11 ? "pj" : "pf";
  const firstPhone = p.phones?.find((ph) => ph.number?.trim())?.number ?? "";
  return {
    id: p.id,
    nome: p.name ?? "",
    documento: doc,
    tipo,
    email: p.email ?? "",
    telefone: firstPhone,
    qtdImoveis:
      typeof p.properties_count === "number"
        ? p.properties_count
        : typeof p.qtd_imoveis === "number"
          ? p.qtd_imoveis
          : 0,
  };
}

export function personDtoToFormData(dto: PersonDto): ProprietarioFormData {
  const phones = dto.phones?.length
    ? dto.phones.map((ph) => ({
        ...createTelefone(),
        number: ph.number ?? "",
        obs: ph.obs ?? "",
      }))
    : [createTelefone()];

  const bankRows =
    dto.bank_accounts?.map((acc) => {
      const type = acc.type
        ? BANK_ACCOUNT_TYPE_REVERSE[acc.type]
        : ("" as const);
      const pix =
        acc.pix_type && PIX_TYPE_REVERSE[acc.pix_type]
          ? PIX_TYPE_REVERSE[acc.pix_type]
          : ("" as const);

      const row = createBankAccount(dto.name ?? "");
      return {
        ...row,
        type,
        bank_id: acc.bank_id != null ? String(acc.bank_id) : "",
        agency: acc.agency ?? "",
        account: acc.account ?? "",
        document: acc.document ? onlyDigits(acc.document) : "",
        favored: acc.favored ?? dto.name ?? "",
        pix_type: pix,
        pix_key: acc.pix_key ?? "",
        main: Boolean(acc.main),
      };
    }) ?? [];

  const birthRaw = dto.birthdate;
  const birthdate =
    typeof birthRaw === "string" && birthRaw.length >= 10
      ? birthRaw.slice(0, 10)
      : "";

  return {
    name: dto.name ?? "",
    email: dto.email ?? "",
    document: dto.document ? onlyDigits(dto.document) : "",
    type: dto.type ?? "person",
    is_renter: Boolean(dto.roles?.includes("renter")),
    rg: dto.rg ?? "",
    rg_origin: dto.rg_origin ?? "",
    telefones: phones,
    birthdate,
    nationality: dto.nationality ?? "Brasileira",
    place_of_birth: dto.place_of_birth ?? "",
    civil_status: dto.civil_status ?? "",
    marriage_regime: parseMarriageRegimeFromApi(dto.marriage_regime),
    occupation: dto.occupation ?? "",
    partner: dto.partner_id ?? "",
    postal_code: dto.address?.postal_code ? onlyDigits(dto.address.postal_code) : "",
    street: dto.address?.street ?? "",
    number: dto.address?.number ?? "",
    complement: dto.address?.complement ?? "",
    neighborhood: dto.address?.neighborhood ?? "",
    city: dto.address?.city ?? "",
    state: dto.address?.state ?? "",
    bank_account: bankRows,
  };
}

export function apiListPersons(accessToken: string): Promise<PersonDto[]> {
  return apiFetch<unknown>("/persons/v1/", {
    method: "GET",
    bearer: accessToken,
  }).then(normalizePersonsList);
}

export function apiGetPerson(
  accessToken: string,
  personId: string,
): Promise<PersonDto> {
  return apiFetch<PersonDto>(`/persons/v1/${personId}`, {
    method: "GET",
    bearer: accessToken,
  });
}

export function apiCreateProprietario(
  accessToken: string,
  data: ProprietarioFormData,
): Promise<void> {
  return apiFetch<void>("/persons/v1/", {
    method: "POST",
    bearer: accessToken,
    json: buildPersonPayload(data),
  });
}

export function apiUpdateProprietario(
  accessToken: string,
  personId: string,
  data: ProprietarioFormData,
): Promise<void> {
  return apiFetch<void>(`/persons/v1/${personId}`, {
    method: "PUT",
    bearer: accessToken,
    json: buildPersonPayload(data),
  });
}

export function apiDeleteProprietario(
  accessToken: string,
  personId: string,
): Promise<void> {
  return apiFetch<void>(`/persons/v1/${personId}`, {
    method: "DELETE",
    bearer: accessToken,
  });
}
