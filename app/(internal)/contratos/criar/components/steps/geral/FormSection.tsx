import type { ReactNode } from 'react'

interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="contrato-criar-form-section">
      <header className="contrato-criar-form-section__head">
        <h3 className="contrato-criar-form-section__title">{title}</h3>
        {description ? (
          <p className="contrato-criar-form-section__desc">{description}</p>
        ) : null}
      </header>
      <div className="contrato-criar-form-section__body">{children}</div>
    </section>
  )
}
