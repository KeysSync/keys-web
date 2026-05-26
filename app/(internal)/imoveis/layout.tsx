import ImoveisShell from "@/app/components/ImoveisShell/ImoveisShell";

export default function ImoveisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="imoveis-layout">
      <ImoveisShell>{children}</ImoveisShell>
    </div>
  );
}
