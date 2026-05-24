export const AUTH_COOKIE = {
  access: "kt_access",
  refresh: "kt_refresh",
} as const;

/** Validade do cookie do refresh (segundos) — 30 dias. */
export const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/** Rotas que NÃO exigem autenticação. */
export const PUBLIC_PATHS = ["/", "/login"] as const;

/** Rota para onde enviar o usuário após login. */
export const AFTER_LOGIN_PATH = "/home";

/** Rota para onde enviar o usuário deslogado. */
export const LOGIN_PATH = "/login";
