"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type SidebarAction = {
  icon: ReactNode;
  label: string;
  href: string;
};

const isActiveRoute = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

const SidebarActions = ({ actions }: { actions: SidebarAction[] }) => {
  const pathname = usePathname();

  return (
    <>
      {actions.map((action) => {
        const isActive = isActiveRoute(pathname, action.href);

        return (
          <Link
            href={action.href}
            key={action.href}
            className={`box action-tooltip${isActive ? " action-tooltip--active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="action-tooltip__icon">{action.icon}</span>
            <span className="action-tooltip__label">{action.label}</span>
          </Link>
        );
      })}
    </>
  );
};

export default SidebarActions;
