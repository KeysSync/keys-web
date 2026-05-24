const clients = [
  "Aurora Imóveis",
  "Vértice",
  "Casa & Cia",
  "Imob Premium",
  "Setor Norte",
  "Habitar",
  "Vila Real",
];

export default function LandingClients() {
  return (
    <section className="landing-clients" aria-label="Imobiliárias que usam Keys">
      <p className="landing-clients__hint">
        Mais de <strong>2 mil</strong> administradoras já confiam no Keys
      </p>
      <div className="landing-clients__row">
        <div className="landing-clients__marquee">
          {[...clients, ...clients].map((c, i) => (
            <span key={i} className="landing-clients__logo">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
