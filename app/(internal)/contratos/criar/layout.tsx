import CriarContratoShell from './components/CriarContratoShell'
import './style.css'

export default function ContratoCriarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="contratos-criar-layout">
      <CriarContratoShell>{children}</CriarContratoShell>
    </div>
  )
}
