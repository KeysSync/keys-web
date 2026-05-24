import { LoginForm } from "@/app/components/LoginForm/LoginForm";
import { ThemeToggle } from "@/app/components/ThemeToggle/ThemeToggle";
import Link from "next/link";
import "./page.css";

export default function Login() {
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
