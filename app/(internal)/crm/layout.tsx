import CrmShell from "@/app/components/CrmShell/CrmShell";

export default function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="crm-layout">
      <CrmShell>{children}</CrmShell>
    </div>
  );
}
