import { LoginForm } from "@/app/components/LoginForm/LoginForm";
import { ThemeToggle } from "@/app/components/ThemeToggle/ThemeToggle";
import { AFTER_LOGIN_PATH, LOGIN_PATH } from "@/lib/auth/constants";
import { getCurrentUser } from "@/lib/auth/session";
import Link from "next/link";
import { redirect } from "next/navigation";
import "./page.css";

type LoginPageProps = {
  searchParams?: Promise<{ from?: string }>;
};

function resolveRedirectTarget(from?: string): string {
  if (!from) return AFTER_LOGIN_PATH;
  if (!from.startsWith("/")) return AFTER_LOGIN_PATH;
  if (from.startsWith("//")) return AFTER_LOGIN_PATH;
  if (from === LOGIN_PATH || from.startsWith(`${LOGIN_PATH}/`)) {
    return AFTER_LOGIN_PATH;
  }
  return from;
}

export default async function Login({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();

  if (user) {
    const params = (await searchParams) ?? {};
    redirect(resolveRedirectTarget(params.from));
  }

  return (
    <div className="login-root">
      <div className="login-root__bg" aria-hidden />

      <Link href="/" className="login-logo" aria-label="Keys" />

      <ThemeToggle variant="ghost" className="login-theme-toggle" />

      <main className="login-main">
        <div className="login-stack">
          <section className="login-card" aria-labelledby="login-card-title">
            <header className="login-card__head">
              <h1 id="login-card-title" className="login-card__title">
                Bem-vindo de volta
              </h1>
              <p className="login-card__subtitle">
                Entre na sua conta para continuar
              </p>
            </header>
            <LoginForm />
          </section>

          <Link href="/#planos" className="login-signup-cta">
            Não possuí acesso? Assine já!
          </Link>
        </div>
      </main>
    </div>
  );
}
