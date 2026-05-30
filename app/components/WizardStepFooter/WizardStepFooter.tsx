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
    <footer className="contract-create-footer">
      <p className="contract-create-footer__hint">{hint}</p>
      <div className="contract-create-footer__actions">
        {onBack ? (
          <button type="button" className="contract-create-footer__back" onClick={onBack}>
            <ArrowLeft size={18} />
            {backLabel}
          </button>
        ) : null}
        {onNext ? (
          <button
            type="button"
            className="contract-create-footer__next"
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
