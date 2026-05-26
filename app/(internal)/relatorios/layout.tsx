import RelatoriosShell from "@/app/components/RelatoriosShell/RelatoriosShell";

export default function RelatoriosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relatorios-layout">
      <RelatoriosShell>{children}</RelatoriosShell>
    </div>
  );
}
