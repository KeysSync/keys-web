import type { ReactNode } from 'react'

interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="contract-create-form-section">
      <header className="contract-create-form-section__head">
        <h3 className="contract-create-form-section__title">{title}</h3>
        {description ? (
          <p className="contract-create-form-section__desc">{description}</p>
        ) : null}
      </header>
      <div className="contract-create-form-section__body">{children}</div>
    </section>
  )
}
