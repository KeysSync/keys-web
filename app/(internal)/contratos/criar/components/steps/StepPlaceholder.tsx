interface StepPlaceholderProps {
  title: string
  description?: string
}

export function StepPlaceholder({ title, description }: StepPlaceholderProps) {
  return (
    <section className="contrato-criar-step-placeholder">
      <p className="contrato-criar-step-placeholder__label">{title}</p>
      <p className="contrato-criar-step-placeholder__desc">
        {description ??
          'Esta etapa será implementada em breve. Volte à etapa Imóvel para continuar o fluxo.'}
      </p>
    </section>
  )
}
