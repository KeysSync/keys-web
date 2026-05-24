import { LoginForm } from "../components/LoginForm/LoginForm";
import { ThemeToggle } from "../components/ThemeToggle/ThemeToggle";
import "./page.css";

export default function Login() {
  return (
    <div className="main">
      <ThemeToggle variant="ghost" className="login-theme-toggle" />
      <div className="logo" />
      <div className="login-panel">
        <h1 className="text-2xl font-bold text-left">Bem vindo</h1>
        <p className="login-subtitle">Entre na sua conta para continuar :)</p>
        <LoginForm />
      </div>
    </div>
  );
}