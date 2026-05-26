"use client";

import { ThemeToggle } from "@/app/components/ThemeToggle/ThemeToggle";
import { LogIn, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { label: "Recursos", href: "#recursos" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Para você", href: "#diferenciais" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Planos", href: "#planos" },
  { label: "Perguntas", href: "#faq" },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <header
      className={`landing-nav ${scrolled ? "landing-nav--scrolled" : ""}`}
    >
      <div className="landing-nav__inner">
        <Link href="/" className="landing-nav__brand" aria-label="Keys">
          <span className="landing-nav__logo" />
          <span className="landing-nav__brand-text">Keys</span>
        </Link>

        <nav className="landing-nav__links" aria-label="Navegação principal">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="landing-nav__link">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="landing-nav__actions">
          <ThemeToggle variant="ghost" className="landing-nav__theme" />
          <Link href="/home" className="landing-nav__login">
            <LogIn size={15} aria-hidden /> Entrar
          </Link>
          <Link href="/home" className="landing-nav__cta">
            Acessar sistema
          </Link>
          <button
            type="button"
            className="landing-nav__menu-btn"
            aria-label="Abrir menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={`landing-nav__sheet ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <nav className="landing-nav__sheet-links">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="landing-nav__sheet-link"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="landing-nav__sheet-actions">
          <Link
            href="/home"
            className="landing-nav__sheet-login"
            onClick={() => setOpen(false)}
          >
            Entrar
          </Link>
          <Link
            href="/home"
            className="landing-nav__sheet-cta"
            onClick={() => setOpen(false)}
          >
            Acessar sistema
          </Link>
        </div>
      </div>
    </header>
  );
}
