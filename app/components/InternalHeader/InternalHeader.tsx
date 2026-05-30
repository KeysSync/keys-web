"use client";

import {
  Bell,
  Command,
  Search
} from "lucide-react";
import { TenantSelector } from "@/app/components/TenantSelector/TenantSelector";
import type { OrganizationTenant } from "@/lib/tenants/org-types";
import { useEffect, useMemo, useRef, useState } from "react";
import "./style.css";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export type InternalHeaderProps = {
  userName?: string;
  searchPlaceholder?: string;
  settingsHref?: string;
  notifications?: NotificationItem[];
  tenants?: OrganizationTenant[];
  showNotificationDot?: boolean;
  onSearch?: (value: string) => void;
  onNotificationsClick?: () => void;
  onTenantChange?: (tenant: OrganizationTenant) => void;
};

const formatCurrentDate = () => {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
};

const InternalHeader = ({
  userName = "Usuario",
  searchPlaceholder = "Buscar algo",
  settingsHref = "/configuracoes",
  notifications = [],
  tenants = [],
  showNotificationDot,
  onSearch,
  onNotificationsClick,
  onTenantChange,
}: InternalHeaderProps) => {
  const formattedDate = useMemo(() => formatCurrentDate(), []);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const hasUnread = notifications.some((item) => !item.read);
  const unreadCount = notifications.filter((item) => !item.read).length;
  const showBadge = showNotificationDot ?? unreadCount > 0;
  const badgeLabel =
    unreadCount > 99 ? "99+" : unreadCount > 0 ? String(unreadCount) : "";

  useEffect(() => {
    if (!notificationsOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!notificationsRef.current?.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNotificationsOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [notificationsOpen]);

  const toggleNotifications = () => {
    setNotificationsOpen((prev) => {
      const next = !prev;
      if (next) onNotificationsClick?.();
      return next;
    });
  };

  return (
    <header className="internal-header">
      <div className="internal-header__greeting">
        <h1 className="internal-header__title">Olá {userName}</h1>
        <p className="internal-header__date">{formattedDate}</p>
      </div>

      <div className="internal-header__search">
        <Search
          className="internal-header__search-icon"
          size={18}
          strokeWidth={2}
          aria-hidden
        />
        <input
          type="search"
          className="internal-header__search-input"
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          onChange={(event) => onSearch?.(event.target.value)}
        />
        <span className="internal-header__search-shortcut" aria-hidden>
          <Command size={13} strokeWidth={2} />
        </span>
      </div>

      <div className="internal-header__actions">
        <TenantSelector tenants={tenants} onTenantChange={onTenantChange} />

        <div
          ref={notificationsRef}
          className={`internal-header__notifications${notificationsOpen ? " internal-header__notifications--open" : ""}`}
        >
          <button
            type="button"
            className="internal-header__icon-button internal-header__icon-button--notifications"
            aria-label={
              unreadCount > 0
                ? `Notificações, ${unreadCount} não lidas`
                : "Notificações"
            }
            aria-haspopup="true"
            aria-expanded={notificationsOpen}
            onClick={toggleNotifications}
          >
            <Bell size={20} strokeWidth={1.85} />
            {showBadge && badgeLabel ? (
              <span className="internal-header__notification-badge" aria-hidden>
                {badgeLabel}
              </span>
            ) : null}
          </button>

          {notificationsOpen ? (
            <div className="internal-header__notifications-panel" role="region" aria-label="Notificações">
              <div className="internal-header__notifications-header">
                <h2>Notificações</h2>
                {hasUnread ? (
                  <span className="internal-header__notifications-badge">
                    {notifications.filter((item) => !item.read).length} novas
                  </span>
                ) : null}
              </div>

              <ul className="internal-header__notifications-list">
                {notifications.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`internal-header__notification-item${item.read ? "" : " internal-header__notification-item--unread"}`}
                    >
                      <span className="internal-header__notification-item-title">
                        {item.title}
                      </span>
                      <span className="internal-header__notification-item-message">
                        {item.message}
                      </span>
                      <span className="internal-header__notification-item-time">
                        {item.time}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default InternalHeader;
