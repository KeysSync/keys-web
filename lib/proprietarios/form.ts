import {
  validateCep,
  validateDocument,
  validateEmail,
  validatePhone,
  validateRequired,
  validateRequiredIsoDate,
  onlyDigits,
} from "@/lib/utils/validation";
import { CIVIL_STATUS_WITH_PARTNER } from "./constants";
import type {
  ProprietarioBankAccount,
  ProprietarioFormData,
  ProprietarioFormErrors,
  ProprietarioTelefone,
} from "./types";

export function createTelefone(): ProprietarioTelefone {
  return {
    id: crypto.randomUUID(),
    number: "",
    obs: "",
  };
}

export function createBankAccount(favoredName = ""): ProprietarioBankAccount {
  return {
    id: crypto.randomUUID(),
    type: "",
    bank_id: "",
    agency: "",
    account: "",
    document: "",
    favored: favoredName,
    pix_type: "",
    pix_key: "",
    main: false,
  };
}

export function defaultProprietarioFormData(): ProprietarioFormData {
  return {
    name: "",
    email: "",
    document: "",
    type: "person",
    is_renter: false,
    rg: "",
    rg_origin: "",
    telefones: [createTelefone()],
    birthdate: "",
    nationality: "Brasileira",
    place_of_birth: "",
    civil_status: "",
    marriage_regime: "",
    occupation: "",
    partner: "",
    postal_code: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    bank_account: [],
  };
}

function accountHasData(acc: ProprietarioBankAccount): boolean {
  return Boolean(
    acc.type ||
      acc.bank_id ||
      acc.agency ||
      acc.account ||
      acc.document ||
      acc.favored ||
      acc.pix_type ||
      acc.pix_key,
  );
}

export function validateProprietarioForm(
  data: ProprietarioFormData,
): ProprietarioFormErrors {
  const errors: ProprietarioFormErrors = {};
  const isPerson = data.type === "person";

  const nameResult = validateRequired(data.name, "Nome");
  if (!nameResult.valid) errors.name = nameResult.message;

  const emailResult = validateEmail(data.email);
  if (!emailResult.valid) errors.email = emailResult.message;

  const docResult = validateDocument(data.document, data.type);
  if (!docResult.valid) errors.document = docResult.message;

  if (isPerson) {
    const birthResult = validateRequiredIsoDate(data.birthdate, "Data de nascimento");
    if (!birthResult.valid) errors.birthdate = birthResult.message;
  }

  const cepResult = validateCep(data.postal_code);
  if (!cepResult.valid) errors.postal_code = cepResult.message;

  const streetResult = validateRequired(data.street, "Logradouro");
  if (!streetResult.valid) errors.street = streetResult.message;

  const cityResult = validateRequired(data.city, "Cidade");
  if (!cityResult.valid) errors.city = cityResult.message;

  const stateResult = validateRequired(data.state, "Estado");
  if (!stateResult.valid) errors.state = stateResult.message;

  if (
    isPerson &&
    data.civil_status &&
    CIVIL_STATUS_WITH_PARTNER.has(data.civil_status) &&
    !data.marriage_regime
  ) {
    errors.marriage_regime = "Regime de casamento é obrigatório.";
  }

  const telefoneErrors: Record<
    string,
    Partial<Record<keyof ProprietarioTelefone, string>>
  > = {};
  for (const tel of data.telefones) {
    const phoneResult = validatePhone(tel.number, false);
    if (!phoneResult.valid) {
      telefoneErrors[tel.id] = {
        number: phoneResult.message ?? "Telefone inválido.",
      };
    }
  }
  if (Object.keys(telefoneErrors).length > 0) {
    errors.telefones = telefoneErrors;
  }

  const bankErrors: Record<
    string,
    Partial<Record<keyof ProprietarioBankAccount, string>>
  > = {};
  for (const acc of data.bank_account) {
    if (!accountHasData(acc)) continue;
    const accErr: Partial<Record<keyof ProprietarioBankAccount, string>> = {};

    if (!acc.type) accErr.type = "Tipo de conta é obrigatório.";
    if (!acc.bank_id) accErr.bank_id = "Banco é obrigatório.";
    if (!acc.document.trim()) {
      accErr.document = "Documento do titular é obrigatório.";
    } else {
      const accDoc = validateDocument(
        acc.document,
        onlyDigits(acc.document).length > 11 ? "enterprise" : "person",
      );
      if (!accDoc.valid) {
        accErr.document = accDoc.message ?? "Documento inválido.";
      }
    }
    if (!acc.favored.trim()) accErr.favored = "Favorecido é obrigatório.";

    if (Object.keys(accErr).length > 0) {
      bankErrors[acc.id] = accErr;
    }
  }
  if (Object.keys(bankErrors).length > 0) {
    errors.bank_account = bankErrors;
  }

  return errors;
}

export function hasFormErrors(errors: ProprietarioFormErrors): boolean {
  const scalarKeys = [
    "name",
    "email",
    "document",
    "type",
    "birthdate",
    "postal_code",
    "street",
    "city",
    "state",
    "marriage_regime",
  ] as const;

  if (scalarKeys.some((key) => Boolean(errors[key]))) return true;
  if (errors.telefones && Object.keys(errors.telefones).length > 0) return true;
  if (errors.bank_account && Object.keys(errors.bank_account).length > 0) {
    return true;
  }
  return false;
}
