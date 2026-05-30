'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import type { ContractPropertySummary } from '@/lib/contracts/property-summary'
import { getContractWizardDraft, patchContractGeneralData } from '@/lib/contracts/wizard/draft'
import {
  addMonthsToIsoDate,
  COMISSAO_OPTIONS,
  CONTRACT_TYPE_OPTIONS,
  defaultContractGeneralData,
  BILLING_SCHEDULE_OPTIONS,
  INDICE_REAJUSTE_OPTIONS,
  isContractGeneralValid,
  MONTH_OPTIONS,
  INSTALLMENT_COUNT_OPTIONS,
  type ContractGeneralData,
} from '@/lib/contracts/wizard/general'
import { CurrencyInputBr } from '@/components/ui/currency-input-br'
import { DateInputBr } from '@/components/ui/date-input-br'
import { IntegerInputBr } from '@/components/ui/integer-input-br'
import { MonthInputBr } from '@/components/ui/month-input-br'
import { PercentInputBr } from '@/components/ui/percent-input-br'
import { ContractSelect } from '@/app/components/ContractSelect/ContractSelect'
import { FormDateRange } from '@/app/components/FormDateRange/FormDateRange'
import { FormField } from '@/app/components/FormField/FormField'
import { FormSection } from '@/app/components/FormSection/FormSection'

const DESCONTO_MODO_OPTIONS = [
  { value: 'percentual', label: 'Percentual (%)' },
  { value: 'rentPercent', label: '% do aluguel' },
  { value: 'fixedAmount', label: 'Valor (R$)' },
] as const

function calcProportionalRent(inicio: string, valor: number): number {
  if (!inicio || !valor) return 0
  const start = new Date(`${inicio}T12:00:00`)
  if (Number.isNaN(start.getTime())) return 0
  const daysInMonth = new Date(
    start.getFullYear(),
    start.getMonth() + 1,
    0,
  ).getDate()
  const daysRemaining = daysInMonth - start.getDate() + 1
  return Math.round((valor / daysInMonth) * daysRemaining * 100) / 100
}

const inputClass = 'contract-create-input'

interface StepGeneralProps {
  propertyId: string | null
  properties: ContractPropertySummary[]
  onValidityChange?: (valid: boolean) => void
}

export function StepGeneral({ propertyId, properties, onValidityChange }: StepGeneralProps) {
  const [data, setData] = useState<ContractGeneralData>(() => {
    const draft = getContractWizardDraft()
    return { ...defaultContractGeneralData(), ...draft.general }
  })

  const property = useMemo(
    () => properties.find((item) => item.id === propertyId),
    [properties, propertyId],
  )

  useEffect(() => {
    onValidityChange?.(isContractGeneralValid(data))
  }, [data, onValidityChange])

  const didPrefillRent = useRef(false)

  useEffect(() => {
    if (!property || didPrefillRent.current || data.rentAmount !== '') return
    didPrefillRent.current = true
    patch({ rentAmount: property.rentAmount })
  }, [property, data.rentAmount])

  function patch(partial: Partial<ContractGeneralData>) {
    setData((prev) => {
      let next = { ...prev, ...partial }

      if (
        'contractStartDate' in partial ||
        'durationMonths' in partial
      ) {
        const meses =
          typeof next.durationMonths === 'number' ? next.durationMonths : 0
        next = {
          ...next,
          contractEndDate: addMonthsToIsoDate(next.contractStartDate, meses),
        }
      }

      patchContractGeneralData(next)
      onValidityChange?.(isContractGeneralValid(next))
      return next
    })
  }

  function handleNumber(
    key: keyof ContractGeneralData,
    raw: string,
    allowEmpty = false,
  ) {
    if (raw === '' && allowEmpty) {
      patch({ [key]: '' } as Partial<ContractGeneralData>)
      return
    }
    const parsed = Number(raw)
    if (Number.isNaN(parsed)) return
    patch({ [key]: parsed } as Partial<ContractGeneralData>)
  }

  function handleRecalculateProportionalRent() {
    const valor =
      typeof data.rentAmount === 'number' ? data.rentAmount : 0
    patch({ proportionalRent: calcProportionalRent(data.contractStartDate, valor) })
  }

  const showCommissionAmount = data.firstRentCommission !== 'none'
  const showTerminationPenalty = data.hasTerminationPenalty

  return (
    <div className="contract-create-step-geral">
      {property ? (
        <div className="contract-create-geral-property">
          <span className="contract-create-geral-property__label">Imóvel vinculado</span>
          <strong>{property.title}</strong>
          <span>{property.street}</span>
        </div>
      ) : null}

      <FormSection
        title="Dados do contrato"
        description="Vigência, cobrança e identificação interna."
      >
        <div className="contract-create-form-row">
          <FormField
            label="Tipo de contrato"
            htmlFor="tipo-contrato"
            className="contract-create-field--grow"
          >
            <ContractSelect
              id="tipo-contrato"
              value={data.contractType}
              options={[
                { value: '', label: 'Selecione' },
                ...CONTRACT_TYPE_OPTIONS,
              ]}
              onChange={(v) =>
                patch({ contractType: v as ContractGeneralData['contractType'] })
              }
            />
          </FormField>

          <FormField
            label="Código interno"
            htmlFor="codigo-interno"
            className="contract-create-field--grow"
          >
            <input
              id="codigo-interno"
              type="text"
              className={inputClass}
              placeholder="Ex.: CTR-2026-0042"
              value={data.internalCode}
              onChange={(e) => patch({ internalCode: e.target.value })}
            />
          </FormField>
        </div>

        <span className="contract-create-form-subhead">Vigência</span>

        <div className="contract-create-form-row">
          <FormDateRange
            startLabel="Início do contrato"
            endLabel="Fim do contrato (auto)"
            startId="inicio-contrato"
            endId="fim-contrato"
            startValue={data.contractStartDate}
            endValue={data.contractEndDate}
            onStartChange={(iso) => patch({ contractStartDate: iso })}
            endDisabled
          />

          <FormField
            label="Duração (meses)"
            htmlFor="duracao-meses"
            className="contract-create-field--num"
          >
            <IntegerInputBr
              id="duracao-meses"
              maxDigits={3}
              value={data.durationMonths}
              onChange={(v) => patch({ durationMonths: v === '' ? '' : v })}
            />
          </FormField>

          <FormDateRange
            startLabel="Assinatura do contrato"
            endLabel="Entrega das chaves"
            startId="assinatura"
            endId="entrega-chaves"
            startValue={data.contractSigningDate}
            endValue={data.keyHandoverDate}
            onStartChange={(iso) => patch({ contractSigningDate: iso })}
            onEndChange={(iso) => patch({ keyHandoverDate: iso })}
          />

          <FormField
            label="Duração base (meses)"
            htmlFor="duracao-base"
            className="contract-create-field--num"
          >
            <IntegerInputBr
              id="duracao-base"
              maxDigits={3}
              value={data.baseDurationMonths}
              onChange={(v) => patch({ baseDurationMonths: v === '' ? '' : v })}
            />
          </FormField>

          <FormField
            label="Renovação automática"
            htmlFor="renovacao-automatica"
            className="contract-create-field--toggle"
          >
            <label className="contract-create-toggle">
              <input
                id="renovacao-automatica"
                type="checkbox"
                checked={data.autoRenewal}
                onChange={(e) => patch({ autoRenewal: e.target.checked })}
              />
              <span className="contract-create-toggle__track" aria-hidden />
              <span className="contract-create-toggle__text">
                {data.autoRenewal ? 'Ativada' : 'Desativada'}
              </span>
            </label>
          </FormField>
        </div>

        <span className="contract-create-form-subhead">Cobrança</span>

        <div className="contract-create-form-row">
          <FormField
            label="Forma de cobrança"
            htmlFor="forma-cobranca"
            className="contract-create-field--grow"
          >
            <ContractSelect
              id="forma-cobranca"
              value={data.billingSchedule}
              options={BILLING_SCHEDULE_OPTIONS}
              onChange={(v) =>
                patch({
                  billingSchedule: v as ContractGeneralData['billingSchedule'],
                })
              }
            />
          </FormField>

          <FormField
            label="1º vencimento a partir de"
            htmlFor="primeiro-vencimento"
            className="contract-create-field--date"
          >
            <DateInputBr
              id="primeiro-vencimento"
              value={data.firstDueDateFrom}
              onChange={(iso) => patch({ firstDueDateFrom: iso })}
            />
          </FormField>

          <FormField
            label="Multa (%)"
            htmlFor="multa"
            className="contract-create-field--percent"
          >
            <PercentInputBr
              id="multa"
              value={data.penaltyPercent}
              onChange={(v) => patch({ penaltyPercent: v === '' ? '' : v })}
            />
          </FormField>

          <FormField
            label="Juros (% ao mês)"
            htmlFor="juros"
            className="contract-create-field--percent"
          >
            <PercentInputBr
              id="juros"
              value={data.monthlyInterestPercent}
              onChange={(v) => patch({ monthlyInterestPercent: v === '' ? '' : v })}
            />
          </FormField>

          <fieldset className="contract-create-radio-group contract-create-radio-group--inline">
            <legend>Calcular multa e juros automaticamente?</legend>
            <label className="contract-create-radio">
              <input
                type="radio"
                name="multa-juros-auto"
                checked={data.autoCalculatePenaltyInterest}
                onChange={() => patch({ autoCalculatePenaltyInterest: true })}
              />
              Sim
            </label>
            <label className="contract-create-radio">
              <input
                type="radio"
                name="multa-juros-auto"
                checked={!data.autoCalculatePenaltyInterest}
                onChange={() => patch({ autoCalculatePenaltyInterest: false })}
              />
              Não
            </label>
          </fieldset>
        </div>
      </FormSection>

      <FormSection
        title="Reajuste e taxa de administração"
        description="Valores financeiros e índices de correção."
      >
        <span className="contract-create-form-subhead">Aluguel e reajuste</span>

        <div className="contract-create-form-row">
          <FormField
            label="Valor do aluguel (R$)"
            htmlFor="valor-aluguel"
            className="contract-create-field--currency"
          >
            <CurrencyInputBr
              id="valor-aluguel"
              value={data.rentAmount}
              onChange={(v) => patch({ rentAmount: v })}
            />
          </FormField>

          <FormField
            label="Aluguel proporcional (R$)"
            className="contract-create-field--currency"
          >
            <div className="contract-create-inline-modes">
              <CurrencyInputBr
                value={data.proportionalRent}
                onChange={(v) => patch({ proportionalRent: v })}
              />
              <button
                type="button"
                className="contract-create-btn-secondary"
                onClick={handleRecalculateProportionalRent}
                aria-label="Recalcular aluguel proporcional"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </FormField>

          <FormField
            label="Mês-base para reajuste"
            htmlFor="mes-base"
            className="contract-create-field--grow"
          >
            <ContractSelect
              id="mes-base"
              value={data.adjustmentBaseMonth}
              options={[{ value: '', label: 'Selecione' }, ...MONTH_OPTIONS]}
              onChange={(v) => patch({ adjustmentBaseMonth: v })}
            />
          </FormField>

          <FormField
            label="Índice de reajuste anual"
            htmlFor="indice-reajuste"
            className="contract-create-field--grow"
          >
            <ContractSelect
              id="indice-reajuste"
              value={data.annualAdjustmentIndex}
              options={INDICE_REAJUSTE_OPTIONS}
              onChange={(v) =>
                patch({
                  annualAdjustmentIndex: v as ContractGeneralData['annualAdjustmentIndex'],
                })
              }
            />
          </FormField>

          <FormDateRange
            variant="month"
            startLabel="Próximo reajuste"
            endLabel="Gerar financeiro"
            startId="proximo-reajuste"
            endId="gerar-financeiro"
            startValue={data.nextAdjustmentDate}
            endValue={data.generateFinancialFrom}
            onStartChange={(iso) => patch({ nextAdjustmentDate: iso })}
            onEndChange={(iso) => patch({ generateFinancialFrom: iso })}
          />
        </div>

        <span className="contract-create-form-subhead">Aluguel garantido</span>

        <div className="contract-create-form-row">
          <fieldset className="contract-create-radio-group contract-create-radio-group--inline">
            <legend>Aluguel garantido?</legend>
            <label className="contract-create-radio">
              <input
                type="radio"
                name="aluguel-garantido"
                checked={data.guaranteedRent}
                onChange={() => patch({ guaranteedRent: true })}
              />
              Sim
            </label>
            <label className="contract-create-radio">
              <input
                type="radio"
                name="aluguel-garantido"
                checked={!data.guaranteedRent}
                onChange={() => patch({ guaranteedRent: false })}
              />
              Não
            </label>
          </fieldset>

          <FormField
            label="Duração garantida (meses)"
            htmlFor="garantido-duracao"
            className="contract-create-field--num"
          >
            <IntegerInputBr
              id="garantido-duracao"
              maxDigits={3}
              disabled={!data.guaranteedRent}
              value={data.guaranteedRentDurationMonths}
              onChange={(v) =>
                patch({ guaranteedRentDurationMonths: v === '' ? '' : v })
              }
            />
          </FormField>
        </div>

        <span className="contract-create-form-subhead">Repasses</span>

        <div className="contract-create-form-row">
          <FormField label="Taxa de administração" className="contract-create-field--grow">
            <div className="contract-create-inline-modes">
              <div className="contract-create-segmented contract-create-segmented--compact">
                <button
                  type="button"
                  className={`contract-create-segmented__btn${data.adminFeeMode === 'percentual' ? ' contract-create-segmented__btn--active' : ''}`}
                  onClick={() => patch({ adminFeeMode: 'percentual' })}
                >
                  %
                </button>
                <button
                  type="button"
                  className={`contract-create-segmented__btn${data.adminFeeMode === 'fixedAmount' ? ' contract-create-segmented__btn--active' : ''}`}
                  onClick={() => patch({ adminFeeMode: 'fixedAmount' })}
                >
                  R$
                </button>
              </div>
              {data.adminFeeMode === 'percentual' ? (
                <PercentInputBr
                  value={data.adminFeeAmount}
                  onChange={(v) => patch({ adminFeeAmount: v })}
                />
              ) : (
                <CurrencyInputBr
                  value={data.adminFeeAmount}
                  onChange={(v) => patch({ adminFeeAmount: v })}
                />
              )}
            </div>
          </FormField>

          <FormField label="Desconto de pontualidade" className="contract-create-field--grow">
            <div className="contract-create-inline-modes contract-create-inline-modes--stack">
              <ContractSelect
                value={data.onTimeDiscountMode}
                options={[...DESCONTO_MODO_OPTIONS]}
                onChange={(v) =>
                  patch({
                    onTimeDiscountMode:
                      v as ContractGeneralData['onTimeDiscountMode'],
                  })
                }
              />
              {data.onTimeDiscountMode === 'fixedAmount' ? (
                <CurrencyInputBr
                  value={data.onTimeDiscountAmount}
                  onChange={(v) => patch({ onTimeDiscountAmount: v })}
                />
              ) : (
                <PercentInputBr
                  value={data.onTimeDiscountAmount}
                  onChange={(v) => patch({ onTimeDiscountAmount: v })}
                />
              )}
            </div>
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Comissão do 1º aluguel">
        <div className="contract-create-form-row">
          <FormField
            label="Comissão"
            htmlFor="comissao-tipo"
            className="contract-create-field--grow"
          >
            <ContractSelect
              id="comissao-tipo"
              value={data.firstRentCommission}
              options={COMISSAO_OPTIONS}
              onChange={(v) =>
                patch({
                  firstRentCommission:
                    v as ContractGeneralData['firstRentCommission'],
                })
              }
            />
          </FormField>

          {showCommissionAmount ? (
            <FormField
              label="Valor"
              htmlFor="comissao-valor"
              className="contract-create-field--currency"
            >
              <CurrencyInputBr
                id="comissao-valor"
                value={data.commissionAmount}
                onChange={(v) => patch({ commissionAmount: v })}
              />
            </FormField>
          ) : null}

          {showCommissionAmount ? (
            <FormField label="Parcelado em" htmlFor="comissao-parcelas">
              <ContractSelect
                id="comissao-parcelas"
                value={String(data.commissionInstallments)}
                options={INSTALLMENT_COUNT_OPTIONS}
                onChange={(v) => handleNumber('commissionInstallments', v)}
              />
            </FormField>
          ) : null}

          {showCommissionAmount ? (
            <FormField
              label="Lançar no mês"
              htmlFor="comissao-mes"
              className="contract-create-field--month"
            >
              <MonthInputBr
                id="comissao-mes"
                value={data.commissionPostMonth}
                onChange={(iso) => patch({ commissionPostMonth: iso })}
              />
            </FormField>
          ) : null}
        </div>
      </FormSection>

      <FormSection title="Rescisão">
        <fieldset className="contract-create-radio-group">
          <legend>Possui multa em rescisão?</legend>
          <label className="contract-create-radio">
            <input
              type="radio"
              name="multa-rescisao"
              checked={data.hasTerminationPenalty}
              onChange={() => patch({ hasTerminationPenalty: true })}
            />
            Sim
          </label>
          <label className="contract-create-radio">
            <input
              type="radio"
              name="multa-rescisao"
              checked={!data.hasTerminationPenalty}
              onChange={() => patch({ hasTerminationPenalty: false })}
            />
            Não
          </label>
        </fieldset>

        {showTerminationPenalty ? (
          <div className="contract-create-form-row">
            <FormField
              label="Valor da multa (R$)"
              htmlFor="multa-rescisao-valor"
              className="contract-create-field--currency"
            >
              <CurrencyInputBr
                id="multa-rescisao-valor"
                value={data.terminationPenaltyAmount}
                onChange={(v) => patch({ terminationPenaltyAmount: v })}
              />
            </FormField>

            <FormField
              label="Isentar após (meses)"
              htmlFor="isentar-meses"
              className="contract-create-field--num"
            >
              <IntegerInputBr
                id="isentar-meses"
                maxDigits={3}
                value={data.waivePenaltyAfterMonths}
                onChange={(v) => patch({ waivePenaltyAfterMonths: v })}
              />
            </FormField>
          </div>
        ) : null}
      </FormSection>

      <FormSection
        title="Condomínio e utilidades"
        description="Informe o que será repassado ou controlado neste contrato."
      >
        <div className="contract-create-checklist">
          <label className="contract-create-check">
            <input
              type="checkbox"
              checked={data.waterUtilities}
              onChange={(e) => patch({ waterUtilities: e.target.checked })}
            />
            Água
          </label>
          <label className="contract-create-check">
            <input
              type="checkbox"
              checked={data.powerUtilities}
              onChange={(e) => patch({ powerUtilities: e.target.checked })}
            />
            Energia elétrica
          </label>
          <label className="contract-create-check">
            <input
              type="checkbox"
              checked={data.gasUtilities}
              onChange={(e) => patch({ gasUtilities: e.target.checked })}
            />
            Gás encanado
          </label>
        </div>
      </FormSection>
    </div>
  )
}
