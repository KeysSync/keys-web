import { apiFetch } from "@/lib/api/client";
import type { AuthUser, LoginCredentials, TokenResponse } from "@/lib/auth/types";

export function apiLogin(credentials: LoginCredentials): Promise<TokenResponse> {
  return apiFetch<TokenResponse>("/auth/v1/login", {
    method: "POST",
    json: credentials,
  });
}

export function apiRefresh(refreshToken: string): Promise<TokenResponse> {
  return apiFetch<TokenResponse>("/auth/v1/refresh", {
    method: "POST",
    json: { refresh_token: refreshToken },
  });
}

export function apiLogout(refreshToken: string): Promise<void> {
  return apiFetch<void>("/auth/v1/logout", {
    method: "POST",
    json: { refresh_token: refreshToken },
  });
}

export function apiGetCurrentUser(accessToken: string): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/v1/access", {
    method: "GET",
    bearer: accessToken,
  });
}
