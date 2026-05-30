'use client'

import { CONTRACT_WIZARD_STEPS } from '@/lib/contracts/wizard/constants'
import type { ContractWizardStepId } from '@/lib/contracts/wizard/types'

interface ContractStepperProps {
  currentStep: ContractWizardStepId
  onStepClick?: (step: ContractWizardStepId) => void
}

export function ContractStepper({ currentStep, onStepClick }: ContractStepperProps) {
  const currentIndex = CONTRACT_WIZARD_STEPS.findIndex((s) => s.id === currentStep)
  const progress = Math.round(((currentIndex + 1) / CONTRACT_WIZARD_STEPS.length) * 100)
  const isFreeNav = Boolean(onStepClick)

  return (
    <nav className="contract-create-stepper" aria-label="Etapas do contrato">
      <div className="contract-create-stepper__progress" aria-hidden>
        <div
          className="contract-create-stepper__progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="contract-create-stepper__meta">
        Etapa {currentIndex + 1} de {CONTRACT_WIZARD_STEPS.length}
      </p>

      <ol className="contract-create-stepper__list">
        {CONTRACT_WIZARD_STEPS.map((step, index) => {
          const isActive = step.id === currentStep
          const isPast = index < currentIndex

          return (
            <li
              key={step.id}
              className={`contract-create-stepper__item${isActive ? ' contract-create-stepper__item--active' : ''}${isPast ? ' contract-create-stepper__item--past' : ''}`}
            >
              <button
                type="button"
                className="contract-create-stepper__btn"
                disabled={!isFreeNav}
                onClick={() => onStepClick?.(step.id)}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className="contract-create-stepper__marker" aria-hidden>
                  {index + 1}
                </span>
                <span className="contract-create-stepper__label">{step.label}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
