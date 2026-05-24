'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'

interface WizardStepFooterProps {
  hint: string
  onBack?: () => void
  backLabel?: string
  onNext?: () => void
  nextLabel?: string
  nextDisabled?: boolean
}

export function WizardStepFooter({
  hint,
  onBack,
  backLabel = 'Voltar',
  onNext,
  nextLabel = 'Continuar',
  nextDisabled = false,
}: WizardStepFooterProps) {
  return (
    <footer className="contrato-criar-footer">
      <p className="contrato-criar-footer__hint">{hint}</p>
      <div className="contrato-criar-footer__actions">
        {onBack ? (
          <button type="button" className="contrato-criar-footer__back" onClick={onBack}>
            <ArrowLeft size={18} />
            {backLabel}
          </button>
        ) : null}
        {onNext ? (
          <button
            type="button"
            className="contrato-criar-footer__next"
            disabled={nextDisabled}
            onClick={onNext}
          >
            {nextLabel}
            <ArrowRight size={18} />
          </button>
        ) : null}
      </div>
    </footer>
  )
}
