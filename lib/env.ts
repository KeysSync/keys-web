/**
 * Acesso tipado às variáveis de ambiente públicas do projeto.
 *
 * - `NEXT_PUBLIC_API_URL`: base da API (ex.: http://localhost:8000)
 * - `NEXT_PUBLIC_APP_ENV`: rótulo lógico do ambiente
 *
 * Os valores são lidos uma única vez no boot do módulo.
 */

export type AppEnv = "local" | "staging" | "production";

function normalizeAppEnv(raw: string | undefined): AppEnv {
  if (raw === "staging" || raw === "production") return raw;
  return "local";
}

function normalizeApiUrl(raw: string | undefined): string {
  const value = (raw ?? "").trim();
  if (!value) return "";
  return value.replace(/\/+$/, "");
}

export const APP_ENV: AppEnv = normalizeAppEnv(
  process.env.NEXT_PUBLIC_APP_ENV,
);

export const API_URL: string = normalizeApiUrl(
  process.env.NEXT_PUBLIC_API_URL,
);

export const IS_PRODUCTION = APP_ENV === "production";
export const IS_STAGING = APP_ENV === "staging";
export const IS_LOCAL = APP_ENV === "local";

/**
 * Garante que a URL da API esteja definida. Use em call sites server-side
 * onde uma API válida é obrigatória.
 */
export function requireApiUrl(): string {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL não está definida. Verifique seu arquivo .env.",
    );
  }
  return API_URL;
}
