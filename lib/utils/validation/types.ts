export type ValidationResult = {
  valid: boolean;
  message?: string;
};

export function valid(): ValidationResult {
  return { valid: true };
}

export function invalid(message: string): ValidationResult {
  return { valid: false, message };
}
