"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "Quanto tempo leva para migrar do meu sistema atual?",
    a: "Entre 3 e 7 dias úteis em média. Nosso time importa imóveis, contratos, locatários, proprietários e histórico financeiro automaticamente. Você acompanha tudo por um checklist de migração.",
  },
  {
    q: "Preciso pagar implantação ou treinamento?",
    a: "Não. Implantação, treinamento e onboarding são gratuitos em todos os planos. Você só paga a mensalidade do plano escolhido.",
  },
  {
    q: "Os boletos têm taxa?",
    a: "A geração de boletos e PIX está incluída no plano. As tarifas bancárias seguem o seu contrato com o banco, sem markup do Keys.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim. Não há fidelidade. Você pode cancelar a qualquer momento e leva consigo todos os seus dados, exportados em formato aberto.",
  },
  {
    q: "Funciona em celular e tablet?",
    a: "Sim. O Keys é 100% responsivo e funciona em qualquer navegador moderno. Corretores e vistoriadores conseguem operar direto do campo.",
  },
  {
    q: "Como funciona a segurança dos dados?",
    a: "Criptografia TLS 1.3 em trânsito e AES-256 em repouso, backups diários com retenção de 30 dias, controle granular de permissões e trilha de auditoria por usuário. Estamos em conformidade com a LGPD.",
  },
];

export default function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="landing-section landing-faq">
      <header className="landing-section__head">
        <span className="landing-section__eyebrow">Perguntas frequentes</span>
        <h2 className="landing-section__title">
          A gente já respondeu sobre isso.
        </h2>
        <p className="landing-section__subtitle">
          Não encontrou o que procurava? Fale com nosso time pelo chat — a
          gente responde rápido.
        </p>
      </header>

      <div className="landing-faq__list">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={item.q}
              className={`landing-faq__item ${isOpen ? "is-open" : ""}`}
            >
              <button
                type="button"
                className="landing-faq__q"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <ChevronDown
                  size={18}
                  aria-hidden
                  className="landing-faq__chev"
                />
              </button>
              <div className="landing-faq__a">
                <p>{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
