import PropertiesShell from "@/app/components/PropertiesShell/PropertiesShell";

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="properties-layout">
      <PropertiesShell>{children}</PropertiesShell>
    </div>
  );
}
