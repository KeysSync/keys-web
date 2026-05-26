'use client'

import { PROPRIETARIO_WIZARD_STEPS } from '@/lib/proprietarios/wizard/constants'
import type { ProprietarioWizardStepId } from '@/lib/proprietarios/wizard/types'

interface ProprietarioStepperProps {
  currentStep: ProprietarioWizardStepId
  onStepClick?: (step: ProprietarioWizardStepId) => void
  stepsWithWarnings?: Set<ProprietarioWizardStepId>
  stepsWithErrors?: Set<ProprietarioWizardStepId>
}

export function ProprietarioStepper({
  currentStep,
  onStepClick,
  stepsWithWarnings,
  stepsWithErrors,
}: ProprietarioStepperProps) {
  const currentIndex = PROPRIETARIO_WIZARD_STEPS.findIndex(
    (s) => s.id === currentStep,
  )
  const progress = Math.round(
    ((currentIndex + 1) / PROPRIETARIO_WIZARD_STEPS.length) * 100,
  )
  const isFreeNav = Boolean(onStepClick)

  return (
    <nav className="contrato-criar-stepper" aria-label="Etapas do proprietário">
      <div className="contrato-criar-stepper__progress" aria-hidden>
        <div
          className="contrato-criar-stepper__progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="contrato-criar-stepper__meta">
        Etapa {currentIndex + 1} de {PROPRIETARIO_WIZARD_STEPS.length}
      </p>

      <ol className="contrato-criar-stepper__list">
        {PROPRIETARIO_WIZARD_STEPS.map((step, index) => {
          const isActive = step.id === currentStep
          const isPast = index < currentIndex
          const hasError = stepsWithErrors?.has(step.id) ?? false
          const hasWarning =
            !hasError && (stepsWithWarnings?.has(step.id) ?? false)

          let itemClass = 'contrato-criar-stepper__item'
          if (isActive) itemClass += ' contrato-criar-stepper__item--active'
          if (isPast) itemClass += ' contrato-criar-stepper__item--past'

          let markerClass = 'contrato-criar-stepper__marker'
          if (hasError) markerClass += ' contrato-criar-stepper__marker--error'
          else if (hasWarning)
            markerClass += ' contrato-criar-stepper__marker--warning'

          return (
            <li key={step.id} className={itemClass}>
              <button
                type="button"
                className="contrato-criar-stepper__btn"
                disabled={!isFreeNav}
                onClick={() => onStepClick?.(step.id)}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className={markerClass} aria-hidden>
                  {index + 1}
                </span>
                <span className="contrato-criar-stepper__label">
                  {step.label}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
