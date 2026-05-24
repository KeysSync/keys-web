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
    <div className={`contrato-criar-field${className ? ` ${className}` : ''}`}>
      <label className="contrato-criar-field__label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint ? <span className="contrato-criar-field__hint">{hint}</span> : null}
    </div>
  )
}
