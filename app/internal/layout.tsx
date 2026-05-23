import { FileIcon, FileSpreadsheetIcon, HouseIcon, UserIcon } from "lucide-react";
import "./style.css";

const InternalLayout = ({ children }: { children: React.ReactNode }) => {
  const actions = [
    {
      icon: <HouseIcon />,
      label: "Dashboard",
      href: "/internal",
    },
    {
      icon: <FileSpreadsheetIcon />,
      label: "Contratos",
      href: "/internal/contratos",
    },
    {
      icon: <UserIcon />,
      label: "Lançamentos",
      href: "/internal/lancamentos",
    },
    {
      icon: <FileIcon />,
      label: "Relatórios",
      href: "/internal/relatorios",
    },
    {
      icon: <FileIcon />,
      label: "Cadastros",
      href: "/internal/usuarios",
    },
    {
      icon: <FileIcon />,
      label: "Logs",
      href: "/internal/usuarios",
    },
  ];

  return (
    <div className="internal-layout">
      <div className="col-actions">
        <div className="col-top">
          <div className="box"></div>
        </div>
        <div className="col-middle">
          {actions.map((action) => (
            <a href={action.href} key={action.href} className="box">
              {action.icon}
            </a>
          ))}
        </div>
        <div className="col-bottom">
          <div className="box"></div>
        </div>
      </div>
      <div className="system">
        <div className="internal-box">{children}</div>
      </div>
    </div>
  );
};

export default InternalLayout;
