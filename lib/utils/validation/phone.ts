import { invalid, valid, type ValidationResult } from "./types";
import { onlyDigits } from "./cpf";

export function validatePhone(value: string, required = false): ValidationResult {
  const digits = onlyDigits(value);
  if (!digits) {
    return required ? invalid("Telefone é obrigatório.") : valid();
  }
  if (digits.length < 10 || digits.length > 11) {
    return invalid("Telefone deve ter 10 ou 11 dígitos.");
  }
  return valid();
}
