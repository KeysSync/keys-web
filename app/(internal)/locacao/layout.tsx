import RentalShell from "@/app/components/RentalShell/RentalShell";

export default function LocacaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rental-layout">
      <RentalShell>{children}</RentalShell>
    </div>
  );
}
