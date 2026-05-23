'use client'

import { Check } from 'lucide-react'
import { CONTRATO_WIZARD_STEPS } from '@/lib/contratos/wizard/constants'
import type { ContratoWizardStepId } from '@/lib/contratos/wizard/types'

interface ContratoStepperProps {
  currentStep: ContratoWizardStepId
  onStepClick?: (step: ContratoWizardStepId) => void
}

export function ContratoStepper({ currentStep, onStepClick }: ContratoStepperProps) {
  const currentIndex = CONTRATO_WIZARD_STEPS.findIndex((s) => s.id === currentStep)
  const progress = Math.round(((currentIndex + 1) / CONTRATO_WIZARD_STEPS.length) * 100)

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
          const isDone = index < currentIndex
          const isClickable = Boolean(onStepClick) && index <= currentIndex

          return (
            <li
              key={step.id}
              className={`contrato-criar-stepper__item${isActive ? ' contrato-criar-stepper__item--active' : ''}${isDone ? ' contrato-criar-stepper__item--done' : ''}`}
            >
              <button
                type="button"
                className="contrato-criar-stepper__btn"
                disabled={!isClickable}
                onClick={() => onStepClick?.(step.id)}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className="contrato-criar-stepper__marker" aria-hidden>
                  {isDone ? <Check size={14} strokeWidth={2.5} /> : index + 1}
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
