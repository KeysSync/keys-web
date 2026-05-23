"use client";

import {
  Bell,
  Command,
  HelpCircle,
  Search
} from "lucide-react";
import { useMemo } from "react";
import "./style.css";

export type InternalHeaderProps = {
  userName?: string;
  searchPlaceholder?: string;
  helpLabel?: string;
  settingsHref?: string;
  showNotificationDot?: boolean;
  onSearch?: (value: string) => void;
  onHelpClick?: () => void;
  onNotificationsClick?: () => void;
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
  helpLabel = "Ajuda",
  settingsHref = "/configuracoes",
  showNotificationDot = true,
  onSearch,
  onHelpClick,
  onNotificationsClick,
}: InternalHeaderProps) => {
  const formattedDate = useMemo(() => formatCurrentDate(), []);

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
        {/* <Link
          href={settingsHref}
          className="internal-header__icon-button"
          aria-label="Configurações"
        >
          <Settings size={20} strokeWidth={1.85} />
        </Link> */}

        <button
          type="button"
          className="internal-header__icon-button internal-header__icon-button--notifications"
          aria-label="Notificações"
          onClick={onNotificationsClick}
        >
          <Bell size={20} strokeWidth={1.85} />
          {showNotificationDot ? (
            <span className="internal-header__notification-dot" aria-hidden />
          ) : null}
        </button>

        <button
          type="button"
          className="internal-header__help-button"
          onClick={onHelpClick}
        >
          <HelpCircle size={18} strokeWidth={2} />
          {/* <span>{helpLabel}</span> */}
        </button>
      </div>
    </header>
  );
};

export default InternalHeader;
