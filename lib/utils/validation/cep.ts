import { invalid, valid, type ValidationResult } from "./types";
import { onlyDigits } from "./cpf";

export function validateCep(value: string): ValidationResult {
  const digits = onlyDigits(value);
  if (!digits) return invalid("CEP é obrigatório.");
  if (digits.length !== 8) return invalid("CEP deve ter 8 dígitos.");
  return valid();
}
