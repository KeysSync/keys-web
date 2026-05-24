import InternalHeader from "@/app/components/InternalHeader/InternalHeader";
import SidebarActions from "@/app/components/SidebarActions";
import { ThemeToggle } from "@/app/components/ThemeToggle/ThemeToggle";
import {
  BadgePercentIcon,
  CircleDollarSignIcon,
  CopyPlusIcon,
  FileSpreadsheetIcon,
  FlagIcon,
  HouseIcon,
  LogsIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import SidebarLogout from "./SidebarLogout";
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
          <Link href="/home">
            <div className="box" />
          </Link>
          <ThemeToggle variant="sidebar" />
        </div>
        <div className="col-middle">
          <SidebarActions actions={actions} />
        </div>
        <div className="col-bottom">
          <SidebarActions actions={bottomActions} />
          <SidebarLogout />
        </div>
      </div>
      <div className="system">
        <div className="internal-box">
          <InternalHeader />
          <main className="internal-box__content">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default InternalLayout;
