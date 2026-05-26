import InternalHeader from "@/app/components/InternalHeader/InternalHeader";
import SidebarActions from "@/app/components/SidebarActions";
import { ThemeToggle } from "@/app/components/ThemeToggle/ThemeToggle";
import { displayName, getCurrentUser } from "@/lib/auth/session";
import {
  Building2Icon,
  CircleDollarSignIcon,
  FileSpreadsheetIcon,
  LayoutDashboardIcon,
  LogsIcon,
  ScrollTextIcon,
  Settings2Icon,
  UsersRoundIcon,
} from "lucide-react";
import Link from "next/link";
import SidebarUserMenu from "./SidebarUserMenu";
import "./style.css";

const InternalLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  const userName = displayName(user);

  const actions = [
    {
      icon: <LayoutDashboardIcon />,
      label: "Dashboard",
      href: "/dashboards",
    },
    {
      icon: <Building2Icon />,
      label: "Imóveis",
      href: "/imoveis",
    },
    {
      icon: <ScrollTextIcon />,
      label: "Locação",
      href: "/locacao",
    },
    {
      icon: <CircleDollarSignIcon />,
      label: "Financeiro",
      href: "/financeiro",
    },
    {
      icon: <UsersRoundIcon />,
      label: "CRM",
      href: "/crm",
    },
    {
      icon: <FileSpreadsheetIcon />,
      label: "Relatórios",
      href: "/relatorios",
    },
    {
      icon: <Settings2Icon />,
      label: "Configurações",
      href: "/configuracoes",
    },
    {
      icon: <LogsIcon />,
      label: "Logs",
      href: "/logs",
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
          <SidebarUserMenu />
        </div>
      </div>
      <div className="system">
        <div className="internal-box">
          <InternalHeader userName={userName} />
          <main className="internal-box__content">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default InternalLayout;
