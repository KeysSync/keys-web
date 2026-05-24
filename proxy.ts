import { NextResponse, type NextRequest } from "next/server";
import {
  AUTH_COOKIE,
  LOGIN_PATH,
  PUBLIC_PATHS,
  REFRESH_COOKIE_MAX_AGE,
} from "@/lib/auth/constants";
import { API_URL, IS_LOCAL } from "@/lib/env";
import type { TokenResponse } from "@/lib/auth/types";

const isPublicPath = (pathname: string): boolean => {
  for (const publicPath of PUBLIC_PATHS) {
    if (pathname === publicPath) return true;
  }
  return false;
};

async function tryRefresh(refreshToken: string): Promise<TokenResponse | null> {
  if (!API_URL) return null;
  try {
    const response = await fetch(`${API_URL}/auth/v1/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as TokenResponse;
  } catch {
    return null;
  }
}

function applyAuthCookies(response: NextResponse, tokens: TokenResponse): void {
  const base = {
    httpOnly: true,
    secure: !IS_LOCAL,
    sameSite: "lax" as const,
    path: "/",
  };

  response.cookies.set({
    ...base,
    name: AUTH_COOKIE.access,
    value: tokens.access_token,
    maxAge: Math.max(tokens.expires_in, 60),
  });

  response.cookies.set({
    ...base,
    name: AUTH_COOKIE.refresh,
    value: tokens.refresh_token,
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });
}

function redirectToLogin(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.search = "";
  const from = request.nextUrl.pathname + request.nextUrl.search;
  if (from && from !== "/") url.searchParams.set("from", from);

  const response = NextResponse.redirect(url);
  response.cookies.delete(AUTH_COOKIE.access);
  response.cookies.delete(AUTH_COOKIE.refresh);
  return response;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(AUTH_COOKIE.access)?.value;
  if (accessToken) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.get(AUTH_COOKIE.refresh)?.value;
  if (!refreshToken) {
    return redirectToLogin(request);
  }

  const tokens = await tryRefresh(refreshToken);
  if (!tokens) {
    return redirectToLogin(request);
  }

  const response = NextResponse.next();
  applyAuthCookies(response, tokens);
  return response;
}

export const config = {
  /*
   * Roda em todas as rotas, exceto:
   * - assets do Next (_next/static, _next/image)
   * - favicon, logos, fundos e demais arquivos com extensão na pasta /public
   */
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\..*).*)"],
};
