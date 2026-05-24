"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import "./style.css";

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    );
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M10.5 10.7A4 4 0 0 0 12 16a4 4 0 0 0 3.9-3.1M6.2 6.2C4.3 7.5 2.9 9.4 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1.1M9.9 5.1A10.1 10.1 0 0 1 12 5c6.5 0 10 7 10 7a17.7 17.7 0 0 1-3.1 4.2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.64 6.053 28.991 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.64 6.053 28.991 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    router.push("/home");
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      {error ? <p className="login-error text-center">{error}</p> : null}
      <div className="login-field">
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="email@imobiliaria.com"
          required
        />
      </div>

      <div className="login-field">
        <label htmlFor="password">Senha</label>
        <div className="login-password-wrapper">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            className="login-password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
      </div>

      <div className="login-options-row">
        <div className="login-remember-me">
          <input type="checkbox" id="remember-me" name="remember-me" />
          <label htmlFor="remember-me">Permanecer logado</label>
        </div>
        <a className="login-forgot-password" href="#">
          Esqueceu sua senha?
        </a>
      </div>

      <button type="submit" className="login-submit-btn" disabled={loading}>
        {loading ? "Entrando…" : "Entrar"}
      </button>

      <div className="login-divider" role="separator">
        <span>Ou</span>
      </div>

      <button
        type="button"
        className="login-google-btn"
        onClick={() => console.log("logando com o google")}
      >
        <GoogleIcon />
        Logar com o Google
      </button>
    </form>
  );
}
