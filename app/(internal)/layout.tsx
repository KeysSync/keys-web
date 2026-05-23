import {
  BadgePercentIcon,
  CircleDollarSignIcon,
  CopyPlusIcon,
  FileSpreadsheetIcon,
  FlagIcon,
  HouseIcon,
  LogsIcon
} from "lucide-react";
import Link from "next/link";
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

  return (
    <div className="internal-layout">
      <div className="col-actions">
        <div className="col-top">
          <Link href="/">
            <div className="box"></div>
          </Link>
        </div>
        <div className="col-middle">
          {actions.map((action) => (
            <Link href={action.href} key={action.href} className="box">
              {action.icon}
            </Link>
          ))}
        </div>
        <div className="col-bottom">
          <Link href="/login">
            <div className="box"></div>
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
