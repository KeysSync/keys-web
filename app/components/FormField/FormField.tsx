import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  htmlFor?: string
  hint?: string
  className?: string
  children: ReactNode
}

export function FormField({
  label,
  htmlFor,
  hint,
  className = '',
  children,
}: FormFieldProps) {
  return (
    <div className={`contract-create-field${className ? ` ${className}` : ''}`}>
      <label className="contract-create-field__label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint ? <span className="contract-create-field__hint">{hint}</span> : null}
    </div>
  )
}
