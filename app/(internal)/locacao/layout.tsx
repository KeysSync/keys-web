import LocacaoShell from "@/app/components/LocacaoShell/LocacaoShell";

export default function LocacaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="locacao-layout">
      <LocacaoShell>{children}</LocacaoShell>
    </div>
  );
}
