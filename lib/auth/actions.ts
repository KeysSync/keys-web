"use server";

import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { apiLogin, apiLogout } from "@/lib/auth/api";
import {
  AFTER_LOGIN_PATH,
  LOGIN_PATH,
} from "@/lib/auth/constants";
import {
  clearAuthCookies,
  getRefreshToken,
  setAuthCookies,
} from "@/lib/auth/cookies";

export interface LoginActionState {
  ok: boolean;
  error?: string;
}

export async function loginAction(
  _prev: LoginActionState | null,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, error: "Informe e-mail e senha." };
  }

  try {
    const tokens = await apiLogin({ email, password });
    await setAuthCookies(tokens);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401 || error.status === 400) {
        return { ok: false, error: "E-mail ou senha incorretos." };
      }
      if (error.status === 422) {
        return { ok: false, error: "Dados inválidos. Verifique e tente novamente." };
      }
      return {
        ok: false,
        error: error.message || "Não foi possível entrar agora. Tente novamente.",
      };
    }
    return {
      ok: false,
      error: "Sem conexão com o servidor. Verifique sua internet.",
    };
  }

  redirect(AFTER_LOGIN_PATH);
}

export async function logoutAction(): Promise<never> {
  const refreshToken = await getRefreshToken();

  if (refreshToken) {
    try {
      await apiLogout(refreshToken);
    } catch {
      // ignora — independente do resultado, limpamos os cookies localmente
    }
  }

  await clearAuthCookies();
  redirect(LOGIN_PATH);
}
