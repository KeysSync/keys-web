import FinanceiroShell from "@/app/components/FinanceiroShell/FinanceiroShell";

export default function FinanceiroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="financeiro-layout">
      <FinanceiroShell>{children}</FinanceiroShell>
    </div>
  );
}
