import { invalid, valid, type ValidationResult } from "./types";

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function cpfCheckDigits(digits: string): boolean {
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(digits[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== Number(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(digits[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  return rest === Number(digits[10]);
}

export function validateCpf(value: string): ValidationResult {
  const digits = onlyDigits(value);
  if (!digits) return invalid("CPF é obrigatório.");
  if (digits.length !== 11) return invalid("CPF deve ter 11 dígitos.");
  if (!cpfCheckDigits(digits)) return invalid("CPF inválido.");
  return valid();
}
