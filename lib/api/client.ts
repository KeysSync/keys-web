import axios, { AxiosError, type AxiosRequestConfig } from "axios";
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

export type ApiRequestInit = {
  method?: string;
  json?: unknown;
  bearer?: string;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

const api = axios.create({
  headers: {
    Accept: "application/json",
  },
});

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
 * Wrapper Axios para a API Keys.
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
  const baseURL = requireApiUrl();

  const config: AxiosRequestConfig = {
    baseURL,
    url: path,
    method: (rest.method as AxiosRequestConfig["method"]) ?? "GET",
    headers: { ...headers },
    signal: rest.signal,
  };

  if (json !== undefined) {
    config.data = json;
    if (!config.headers!["Content-Type"]) {
      config.headers!["Content-Type"] = "application/json";
    }
  }

  if (bearer) {
    config.headers!["Authorization"] = `Bearer ${bearer}`;
  }

  try {
    const response = await api.request<T>(config);

    if (response.status === 204) {
      return undefined as T;
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { status, data } = error.response;
      throw new ApiError(
        extractErrorMessage(data, `Falha na requisição (${status})`),
        status,
        data,
      );
    }
    throw error;
  }
}
