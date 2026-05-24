import { requireApiUrl } from "@/lib/env";

export class ApiError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export type ApiRequestInit = RequestInit & {
  /** Body JSON-serializável. Sobrescreve `init.body`. */
  json?: unknown;
  /** Token Bearer enviado em Authorization. */
  bearer?: string;
};

function joinUrl(base: string, path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/")) return `${base}${path}`;
  return `${base}/${path}`;
}

async function parseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    return text || null;
  }
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function extractErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object") {
    const detail = (payload as { detail?: unknown }).detail;
    if (typeof detail === "string" && detail) return detail;
    if (Array.isArray(detail)) {
      const first = detail[0] as { msg?: string } | undefined;
      if (first && typeof first.msg === "string" && first.msg) return first.msg;
    }
    const message = (payload as { message?: unknown }).message;
    if (typeof message === "string" && message) return message;
  }
  return fallback;
}

/**
 * Fetch wrapper para a API Keys.
 *
 * - Resolve a URL contra `NEXT_PUBLIC_API_URL`.
 * - Serializa `init.json` como JSON e seta `Content-Type` automaticamente.
 * - Adiciona `Authorization: Bearer <token>` quando `bearer` é informado.
 * - Lança `ApiError` em respostas não-OK.
 */
export async function apiFetch<T = unknown>(
  path: string,
  init: ApiRequestInit = {},
): Promise<T> {
  const { json, bearer, headers, ...rest } = init;
  const url = joinUrl(requireApiUrl(), path);

  const composedHeaders = new Headers(headers);
  if (json !== undefined && !composedHeaders.has("Content-Type")) {
    composedHeaders.set("Content-Type", "application/json");
  }
  if (!composedHeaders.has("Accept")) {
    composedHeaders.set("Accept", "application/json");
  }
  if (bearer) {
    composedHeaders.set("Authorization", `Bearer ${bearer}`);
  }

  const body = json !== undefined ? JSON.stringify(json) : rest.body;

  const response = await fetch(url, {
    ...rest,
    headers: composedHeaders,
    body,
    cache: rest.cache ?? "no-store",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await parseBody(response);

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(payload, `Falha na requisição (${response.status})`),
      response.status,
      payload,
    );
  }

  return payload as T;
}
