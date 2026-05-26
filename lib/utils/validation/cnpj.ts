import { invalid, valid, type ValidationResult } from "./types";
import { onlyDigits } from "./cpf";

function cnpjCheckDigits(digits: string): boolean {
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const calc = (length: number) => {
    const weights =
      length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += Number(digits[i]) * weights[i];
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const d1 = calc(12);
  if (d1 !== Number(digits[12])) return false;
  const d2 = calc(13);
  return d2 === Number(digits[13]);
}

export function validateCnpj(value: string): ValidationResult {
  const digits = onlyDigits(value);
  if (!digits) return invalid("CNPJ é obrigatório.");
  if (digits.length !== 14) return invalid("CNPJ deve ter 14 dígitos.");
  if (!cnpjCheckDigits(digits)) return invalid("CNPJ inválido.");
  return valid();
}
