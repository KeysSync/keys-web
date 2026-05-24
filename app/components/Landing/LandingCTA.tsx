import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

export default function LandingCTA() {
  return (
    <section className="landing-section landing-cta">
      <div className="landing-cta__inner">
        <div className="landing-cta__copy">
          <h2 className="landing-cta__title">
            Pronto para administrar sua imobiliária no piloto automático?
          </h2>
          <p className="landing-cta__subtitle">
            Teste o Keys por 14 dias com toda a sua carteira. Sem cartão de
            crédito, sem fidelidade, sem custo de migração.
          </p>
        </div>

        <div className="landing-cta__actions">
          <Link href="/login" className="landing-btn landing-btn--primary">
            Acessar o sistema
            <ArrowRight size={16} aria-hidden />
          </Link>
          <Link href="/login" className="landing-btn landing-btn--ghost-light">
            <Calendar size={16} aria-hidden /> Agendar uma demonstração
          </Link>
        </div>
      </div>
    </section>
  );
}
