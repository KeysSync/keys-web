import { DateInputBr } from '@/components/ui/date-input-br'
import { MonthInputBr } from '@/components/ui/month-input-br'
import { FormField } from './FormField'

interface FormDateRangeProps {
  startLabel: string
  endLabel: string
  startId: string
  endId: string
  startValue: string
  endValue: string
  onStartChange?: (iso: string) => void
  onEndChange?: (iso: string) => void
  startDisabled?: boolean
  endDisabled?: boolean
  variant?: 'date' | 'month'
}

export function FormDateRange({
  startLabel,
  endLabel,
  startId,
  endId,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  startDisabled,
  endDisabled,
  variant = 'date',
}: FormDateRangeProps) {
  const fieldClass = 'contrato-criar-field--date'

  return (
    <div className="contrato-criar-date-row">
      <FormField label={startLabel} htmlFor={startId} className={fieldClass}>
        {variant === 'month' ? (
          <MonthInputBr
            id={startId}
            value={startValue}
            disabled={startDisabled}
            onChange={onStartChange ?? (() => undefined)}
          />
        ) : (
          <DateInputBr
            id={startId}
            value={startValue}
            disabled={startDisabled}
            onChange={onStartChange}
          />
        )}
      </FormField>

      <FormField label={endLabel} htmlFor={endId} className={fieldClass}>
        {variant === 'month' ? (
          <MonthInputBr
            id={endId}
            value={endValue}
            disabled={endDisabled}
            onChange={onEndChange ?? (() => undefined)}
          />
        ) : (
          <DateInputBr
            id={endId}
            value={endValue}
            disabled={endDisabled}
            onChange={onEndChange}
          />
        )}
      </FormField>
    </div>
  )
}
