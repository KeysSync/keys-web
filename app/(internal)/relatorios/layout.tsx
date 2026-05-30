import ReportsShell from "@/app/components/ReportsShell/ReportsShell";

export default function RelatoriosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="reports-layout">
      <ReportsShell>{children}</ReportsShell>
    </div>
  );
}
