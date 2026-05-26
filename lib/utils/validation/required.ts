import { invalid, valid, type ValidationResult } from "./types";

export function validateRequired(
  value: string,
  label: string,
): ValidationResult {
  if (!value.trim()) return invalid(`${label} é obrigatório.`);
  return valid();
}

export function validateRequiredIsoDate(
  value: string,
  label: string,
): ValidationResult {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return invalid(`${label} é obrigatório.`);
  }
  return valid();
}
