'use client'

import { CONTRATO_WIZARD_STEPS } from '@/lib/contratos/wizard/constants'
import type { ContratoWizardStepId } from '@/lib/contratos/wizard/types'

interface ContratoStepperProps {
  currentStep: ContratoWizardStepId
  onStepClick?: (step: ContratoWizardStepId) => void
}

export function ContratoStepper({ currentStep, onStepClick }: ContratoStepperProps) {
  const currentIndex = CONTRATO_WIZARD_STEPS.findIndex((s) => s.id === currentStep)
  const progress = Math.round(((currentIndex + 1) / CONTRATO_WIZARD_STEPS.length) * 100)
  const isFreeNav = Boolean(onStepClick)

  return (
    <nav className="contrato-criar-stepper" aria-label="Etapas do contrato">
      <div className="contrato-criar-stepper__progress" aria-hidden>
        <div
          className="contrato-criar-stepper__progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="contrato-criar-stepper__meta">
        Etapa {currentIndex + 1} de {CONTRATO_WIZARD_STEPS.length}
      </p>

      <ol className="contrato-criar-stepper__list">
        {CONTRATO_WIZARD_STEPS.map((step, index) => {
          const isActive = step.id === currentStep
          const isPast = index < currentIndex

          return (
            <li
              key={step.id}
              className={`contrato-criar-stepper__item${isActive ? ' contrato-criar-stepper__item--active' : ''}${isPast ? ' contrato-criar-stepper__item--past' : ''}`}
            >
              <button
                type="button"
                className="contrato-criar-stepper__btn"
                disabled={!isFreeNav}
                onClick={() => onStepClick?.(step.id)}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className="contrato-criar-stepper__marker" aria-hidden>
                  {index + 1}
                </span>
                <span className="contrato-criar-stepper__label">{step.label}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
