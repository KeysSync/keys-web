import "server-only";

import { cache } from "react";
import { ApiError } from "@/lib/api/client";
import { apiGetCurrentUser, apiRefresh } from "@/lib/auth/api";
import {
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
} from "@/lib/auth/cookies";
import type { AuthUser } from "@/lib/auth/types";

/**
 * Retorna o usuário autenticado no servidor.
 *
 * 1. Tenta com o access_token do cookie.
 * 2. Em 401, tenta refresh com o refresh_token e refaz a chamada.
 * 3. Retorna `null` se não houver sessão válida.
 *
 * Encapsulado em `cache()` para deduplicar chamadas dentro do mesmo render.
 */
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const accessToken = await getAccessToken();

  if (accessToken) {
    try {
      return await apiGetCurrentUser(accessToken);
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) {
        return null;
      }
    }
  }

  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  try {
    const tokens = await apiRefresh(refreshToken);
    await setAuthCookies(tokens);
    return tokens.user;
  } catch {
    return null;
  }
});

/** Nome exibível do usuário (parte antes do `@` quando não houver `name`). */
export function displayName(user: AuthUser | null): string {
  if (!user) return "Usuário";
  const [local] = user.email.split("@");
  if (!local) return "Usuário";
  return local
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
