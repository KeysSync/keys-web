import Link from "next/link";

const columns = [
  {
    title: "Produto",
    links: [
      { label: "Recursos", href: "#recursos" },
      { label: "Como funciona", href: "#como-funciona" },
      { label: "Planos", href: "#planos" },
      { label: "Segurança", href: "#diferenciais" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre nós", href: "#" },
      { label: "Carreiras", href: "#" },
      { label: "Imprensa", href: "#" },
      { label: "Contato", href: "#" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Blog", href: "#" },
      { label: "Central de ajuda", href: "#" },
      { label: "Status do sistema", href: "#" },
      { label: "API e integrações", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Termos de uso", href: "#" },
      { label: "Política de privacidade", href: "#" },
      { label: "LGPD", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer__inner">
        <div className="landing-footer__brand">
          <div className="landing-footer__brand-row">
            <span className="landing-footer__logo" />
            <strong>Keys</strong>
          </div>
          <p className="landing-footer__about">
            O sistema completo para administradoras de imóveis. Contratos,
            cobrança, repasses e relatórios em um só lugar.
          </p>
          <div className="landing-footer__cta">
            <Link href="/login" className="landing-footer__cta-btn">
              Acessar o sistema
            </Link>
          </div>
        </div>

        <div className="landing-footer__cols">
          {columns.map((c) => (
            <div key={c.title} className="landing-footer__col">
              <span className="landing-footer__col-title">{c.title}</span>
              <ul>
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="landing-footer__bottom">
        <span>© {new Date().getFullYear()} Keys · Todos os direitos reservados</span>
        <span>Feito com cuidado para imobiliárias brasileiras</span>
      </div>
    </footer>
  );
}
