import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Reduzimos em 70% o tempo gasto com cobrança. A equipe finalmente respira e o repasse sai sempre no dia certo.",
    author: "Mariana Lopes",
    role: "Diretora · Aurora Imóveis",
    rating: 5,
  },
  {
    quote:
      "Migração tranquila, sem perda de dado. Em 1 semana a nossa carteira inteira estava operando no Keys.",
    author: "Rafael Tavares",
    role: "Sócio · Vértice Administradora",
    rating: 5,
  },
  {
    quote:
      "Os relatórios são lindos e claros. Meus proprietários adoraram o portal — diminuiu drasticamente as ligações.",
    author: "Carla Mendes",
    role: "Gerente · Habitar Imóveis",
    rating: 5,
  },
];

export default function LandingTestimonials() {
  return (
    <section id="depoimentos" className="landing-section landing-testimonials">
      <header className="landing-section__head">
        <span className="landing-section__eyebrow">Depoimentos</span>
        <h2 className="landing-section__title">
          Quem usa, recomenda.
        </h2>
        <p className="landing-section__subtitle">
          Administradoras de todo o país já transformaram suas operações com o
          Keys.
        </p>
      </header>

      <div className="landing-testimonials__grid">
        {testimonials.map((t) => (
          <article key={t.author} className="landing-testimonial">
            <Quote
              size={22}
              aria-hidden
              className="landing-testimonial__quote"
            />
            <div
              className="landing-testimonial__stars"
              aria-label={`${t.rating} estrelas`}
            >
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={14} fill="currentColor" aria-hidden />
              ))}
            </div>
            <p className="landing-testimonial__text">{t.quote}</p>
            <footer className="landing-testimonial__foot">
              <span className="landing-testimonial__avatar" aria-hidden>
                {t.author
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("")}
              </span>
              <div>
                <strong>{t.author}</strong>
                <span>{t.role}</span>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
