import {
  BadgePercentIcon,
  CircleDollarSignIcon,
  CopyPlusIcon,
  FileSpreadsheetIcon,
  FlagIcon,
  HouseIcon,
  LogsIcon,
  SettingsIcon
} from "lucide-react";
import Link from "next/link";
import SidebarActions from "./SidebarActions";
import "./style.css";

const InternalLayout = ({ children }: { children: React.ReactNode }) => {
  const actions = [
    {
      icon: <HouseIcon />,
      label: "Dashboard",
      href: "/dashboards",
    },
    {
      icon: <FileSpreadsheetIcon />,
      label: "Contratos",
      href: "/contratos",
    },
    {
      icon: <BadgePercentIcon />,
      label: "Lançamentos",
      href: "/lancamentos",
    },
    {
      icon: <CircleDollarSignIcon />,
      label: "Financeiro",
      href: "/financeiro",
    },
    {
      icon: <FlagIcon />,
      label: "Relatórios",
      href: "/relatorios",
    },
    {
      icon: <CopyPlusIcon />,
      label: "Cadastros",
      href: "/cadastros",
    },
    {
      icon: <LogsIcon />,
      label: "Logs",
      href: "/logs",
    },
  ];

  const bottomActions = [
    {
      icon: <SettingsIcon />,
      label: "Configurações",
      href: "/configuracoes",
    },
  ];

  return (
    <div className="internal-layout">
      <div className="col-actions">
        <div className="col-top">
          <Link href="/">
            <div className="box"></div>
          </Link>
        </div>
        <div className="col-middle">
          <SidebarActions actions={actions} />
        </div>
        <div className="col-bottom">
          <SidebarActions actions={bottomActions} />
          <Link href="/login">
            <div className="box box-avatar"></div>
          </Link>
        </div>
      </div>
      <div className="system">
        <div className="internal-box">{children}</div>
      </div>
    </div>
  );
};

export default InternalLayout;
