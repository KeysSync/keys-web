import { logoutAction } from "@/lib/auth/actions";

export default function SidebarLogout() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        aria-label="Sair"
        title="Sair"
        className="sidebar-logout"
      >
        <div className="box box-avatar" />
      </button>
    </form>
  );
}
