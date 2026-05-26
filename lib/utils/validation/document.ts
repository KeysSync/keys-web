import type { ValidationResult } from "./types";
import { validateCnpj } from "./cnpj";
import { onlyDigits, validateCpf } from "./cpf";

export type DocumentKind = "person" | "enterprise";

export function validateDocument(
  value: string,
  kind: DocumentKind,
): ValidationResult {
  const digits = onlyDigits(value);
  if (kind === "enterprise") {
    return validateCnpj(digits.length === 14 ? value : digits);
  }
  return validateCpf(digits.length === 11 ? value : digits);
}
