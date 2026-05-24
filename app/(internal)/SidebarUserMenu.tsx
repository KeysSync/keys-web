"use client";

import { logoutAction } from "@/lib/auth/actions";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function SidebarUserMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`sidebar-user-menu${open ? " sidebar-user-menu--open" : ""}`}
    >
      <button
        type="button"
        className="sidebar-user-menu__trigger"
        aria-label="Menu do usuário"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="box box-avatar" />
      </button>

      {open ? (
        <div className="sidebar-user-menu__dropdown" role="menu">
          <Link
            href="/configuracoes"
            className="sidebar-user-menu__item"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <Settings size={16} aria-hidden />
            <span>Configurações</span>
          </Link>

          <form action={logoutAction} className="sidebar-user-menu__form">
            <button
              type="submit"
              className="sidebar-user-menu__item sidebar-user-menu__item--danger"
              role="menuitem"
            >
              <LogOut size={16} aria-hidden />
              <span>Sair</span>
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
