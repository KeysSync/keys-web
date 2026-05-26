import { invalid, valid, type ValidationResult } from "./types";

const EMAIL_RE =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function validateEmail(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return invalid("E-mail é obrigatório.");
  if (!EMAIL_RE.test(trimmed)) return invalid("E-mail inválido.");
  return valid();
}
