'use client'

export interface WizardStep {
  id: string
  label: string
}

interface WizardStepperProps {
  steps: readonly WizardStep[]
  currentStep: string
  onStepClick?: (stepId: string) => void
  stepsWithWarnings?: Set<string>
  stepsWithErrors?: Set<string>
  ariaLabel?: string
}

export function WizardStepper({
  steps,
  currentStep,
  onStepClick,
  stepsWithWarnings,
  stepsWithErrors,
  ariaLabel = 'Etapas do formulário',
}: WizardStepperProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep)
  const progress = Math.round(((currentIndex + 1) / steps.length) * 100)
  const isFreeNav = Boolean(onStepClick)

  return (
    <nav className="contrato-criar-stepper" aria-label={ariaLabel}>
      <div className="contrato-criar-stepper__progress" aria-hidden>
        <div
          className="contrato-criar-stepper__progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="contrato-criar-stepper__meta">
        Etapa {currentIndex + 1} de {steps.length}
      </p>

      <ol className="contrato-criar-stepper__list">
        {steps.map((step, index) => {
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
