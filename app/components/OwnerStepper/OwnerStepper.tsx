'use client'

import { OWNER_WIZARD_STEPS } from '@/lib/owners/wizard/constants'
import type { OwnerWizardStepId } from '@/lib/owners/wizard/types'

interface OwnerStepperProps {
  currentStep: OwnerWizardStepId
  onStepClick?: (step: OwnerWizardStepId) => void
  stepsWithWarnings?: Set<OwnerWizardStepId>
  stepsWithErrors?: Set<OwnerWizardStepId>
}

export function OwnerStepper({
  currentStep,
  onStepClick,
  stepsWithWarnings,
  stepsWithErrors,
}: OwnerStepperProps) {
  const currentIndex = OWNER_WIZARD_STEPS.findIndex(
    (s) => s.id === currentStep,
  )
  const progress = Math.round(
    ((currentIndex + 1) / OWNER_WIZARD_STEPS.length) * 100,
  )
  const isFreeNav = Boolean(onStepClick)

  return (
    <nav className="contract-create-stepper" aria-label="Etapas do proprietário">
      <div className="contract-create-stepper__progress" aria-hidden>
        <div
          className="contract-create-stepper__progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="contract-create-stepper__meta">
        Etapa {currentIndex + 1} de {OWNER_WIZARD_STEPS.length}
      </p>

      <ol className="contract-create-stepper__list">
        {OWNER_WIZARD_STEPS.map((step, index) => {
          const isActive = step.id === currentStep
          const isPast = index < currentIndex
          const hasError = stepsWithErrors?.has(step.id) ?? false
          const hasWarning =
            !hasError && (stepsWithWarnings?.has(step.id) ?? false)

          let itemClass = 'contract-create-stepper__item'
          if (isActive) itemClass += ' contract-create-stepper__item--active'
          if (isPast) itemClass += ' contract-create-stepper__item--past'

          let markerClass = 'contract-create-stepper__marker'
          if (hasError) markerClass += ' contract-create-stepper__marker--error'
          else if (hasWarning)
            markerClass += ' contract-create-stepper__marker--warning'

          return (
            <li key={step.id} className={itemClass}>
              <button
                type="button"
                className="contract-create-stepper__btn"
                disabled={!isFreeNav}
                onClick={() => onStepClick?.(step.id)}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className={markerClass} aria-hidden>
                  {index + 1}
                </span>
                <span className="contract-create-stepper__label">
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
