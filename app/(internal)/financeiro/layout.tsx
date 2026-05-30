import FinancialShell from "@/app/components/FinancialShell/FinancialShell";

export default function FinanceiroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="financial-layout">
      <FinancialShell>{children}</FinancialShell>
    </div>
  );
}
