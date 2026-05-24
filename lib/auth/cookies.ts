import { cookies } from "next/headers";
import { IS_LOCAL } from "@/lib/env";
import {
  AUTH_COOKIE,
  REFRESH_COOKIE_MAX_AGE,
} from "@/lib/auth/constants";
import type { TokenResponse } from "@/lib/auth/types";

interface CookieBase {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: "/";
}

function baseOptions(): CookieBase {
  return {
    httpOnly: true,
    secure: !IS_LOCAL,
    sameSite: "lax",
    path: "/",
  };
}

/** Grava os dois cookies de autenticação a partir do TokenResponse. */
export async function setAuthCookies(tokens: TokenResponse): Promise<void> {
  const jar = await cookies();
  const base = baseOptions();

  jar.set({
    ...base,
    name: AUTH_COOKIE.access,
    value: tokens.access_token,
    maxAge: Math.max(tokens.expires_in, 60),
  });

  jar.set({
    ...base,
    name: AUTH_COOKIE.refresh,
    value: tokens.refresh_token,
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });
}

/** Apaga os dois cookies de autenticação. */
export async function clearAuthCookies(): Promise<void> {
  const jar = await cookies();
  jar.delete(AUTH_COOKIE.access);
  jar.delete(AUTH_COOKIE.refresh);
}

export async function getAccessToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(AUTH_COOKIE.access)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(AUTH_COOKIE.refresh)?.value ?? null;
}
