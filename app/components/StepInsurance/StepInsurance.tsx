'use client'

import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { getContractWizardDraft, patchContractInsuranceData } from '@/lib/contracts/wizard/draft'
import {
  createInsuranceItem,
  defaultContractInsurancesData,
  getInsuranceTypeLabel,
  INSURANCE_PAYER_OPTIONS,
  INSURANCE_TYPE_OPTIONS,
  type ContractInsurancesData,
  type InsurancePayer,
  type InsuranceType,
} from '@/lib/contracts/wizard/insurance'
import { CurrencyInputBr } from '@/components/ui/currency-input-br'
import { MaskedTextInputBr } from '@/components/ui/masked-text-input-br'
import { formatBrCurrency } from '@/lib/format/br'
import { ContractSelect } from '@/app/components/ContractSelect/ContractSelect'
import { FormDateRange } from '@/app/components/FormDateRange/FormDateRange'
import { FormField } from '@/app/components/FormField/FormField'
import { FormSection } from '@/app/components/FormSection/FormSection'

const inputClass = 'contract-create-input'

export function StepInsurance() {
  const [data, setData] = useState<ContractInsurancesData>(() => {
    const draft = getContractWizardDraft()
    return { ...defaultContractInsurancesData(), ...draft.insurance }
  })

  const activeType = INSURANCE_TYPE_OPTIONS.find((o) => o.value === data.activeTypeMenu)

  function persist(next: ContractInsurancesData) {
    setData(next)
    patchContractInsuranceData(next)
  }

  function patchDraft(partial: Partial<ContractInsurancesData['draft']>) {
    persist({ ...data, draft: { ...data.draft, ...partial } })
  }

  function selectActiveTypeMenu(type: InsuranceType) {
    persist({ ...data, activeTypeMenu: type })
  }

  function addInsurance() {
    const item = createInsuranceItem(data.activeTypeMenu, data.draft)
    persist({
      ...data,
      items: [...data.items, item],
      draft: defaultContractInsurancesData().draft,
    })
  }

  function removeItem(id: string) {
    persist({ ...data, items: data.items.filter((i) => i.id !== id) })
  }

  return (
    <div className="contract-create-step-form">
      <FormSection
        title="Modalidade"
        description="Escolha o tipo de seguro e preencha os dados da apólice."
      >
        <nav
          className="contract-create-segmented contract-create-segmented--wrap contract-create-seguros-submenu"
          role="tablist"
          aria-label="Tipo de seguro"
        >
          {INSURANCE_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={data.activeTypeMenu === opt.value}
              className={`contract-create-segmented__btn${data.activeTypeMenu === opt.value ? ' contract-create-segmented__btn--active' : ''}`}
              onClick={() => selectActiveTypeMenu(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </nav>

        {activeType ? (
          <p className="contract-create-seguros-submenu__hint">{activeType.description}</p>
        ) : null}

        <div className="contract-create-form-row">
          <FormField
            label="Seguradora"
            htmlFor="seguradora"
            className="contract-create-field--grow"
          >
            <input
              id="seguradora"
              type="text"
              className={inputClass}
              value={data.draft.insurer}
              onChange={(e) => patchDraft({ insurer: e.target.value })}
              placeholder="Nome da seguradora"
            />
          </FormField>

          <FormField label="Número da apólice" htmlFor="apolice">
            <MaskedTextInputBr
              id="apolice"
              mask="policy"
              value={data.draft.policyNumber}
              onChange={(v) => patchDraft({ policyNumber: v })}
            />
          </FormField>

          <FormField
            label="Quem paga o prêmio"
            htmlFor="seguro-responsavel"
            className="contract-create-field--grow"
          >
            <ContractSelect
              id="seguro-responsavel"
              value={data.draft.payer}
              options={INSURANCE_PAYER_OPTIONS}
              onChange={(v) =>
                patchDraft({
                  payer: v as InsurancePayer,
                })
              }
            />
          </FormField>
        </div>

        <div className="contract-create-form-row">
          <FormField
            label="Valor de cobertura (R$)"
            htmlFor="cobertura"
            className="contract-create-field--currency"
          >
            <CurrencyInputBr
              id="cobertura"
              value={data.draft.coverageAmount}
              onChange={(v) => patchDraft({ coverageAmount: v })}
            />
          </FormField>

          <FormField
            label="Prêmio mensal (R$)"
            htmlFor="premio"
            className="contract-create-field--currency"
          >
            <CurrencyInputBr
              id="premio"
              value={data.draft.monthlyPremium}
              onChange={(v) => patchDraft({ monthlyPremium: v })}
            />
          </FormField>

          <FormDateRange
            startLabel="Vigência — início"
            endLabel="Vigência — fim"
            startId="seguro-inicio"
            endId="seguro-fim"
            startValue={data.draft.validFrom}
            endValue={data.draft.validUntil}
            onStartChange={(iso) => patchDraft({ validFrom: iso })}
            onEndChange={(iso) => patchDraft({ validUntil: iso })}
          />
        </div>

        <FormField label="Observações" htmlFor="seguro-obs">
          <textarea
            id="seguro-obs"
            className="contract-create-textarea"
            rows={2}
            value={data.draft.notes}
            onChange={(e) => patchDraft({ notes: e.target.value })}
          />
        </FormField>

        <div className="contract-create-seguros-actions">
          <button type="button" className="contract-create-btn-ghost" onClick={addInsurance}>
            <Plus size={18} />
            Incluir {getInsuranceTypeLabel(data.activeTypeMenu).toLowerCase()}
          </button>
        </div>
      </FormSection>

      <FormSection
        title="Seguros do contrato"
        description="Apólices já vinculadas a este cadastro."
      >
        {data.items.length === 0 ? (
          <div className="contract-create-locatarios-empty">
            <p>Nenhum seguro incluído.</p>
            <span>Use o submenu acima para escolher a modalidade e incluir a apólice.</span>
          </div>
        ) : (
          <ul className="contract-create-seguros-list">
            {data.items.map((item) => (
              <li key={item.id} className="contract-create-seguro-card">
                <div className="contract-create-seguro-card__head">
                  <div>
                    <strong>{getInsuranceTypeLabel(item.type)}</strong>
                    {item.insurer ? (
                      <span className="contract-create-seguro-card__meta">
                        {item.insurer}
                        {item.policyNumber ? ` · Apólice ${item.policyNumber}` : ''}
                      </span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="contract-create-lancamento-row__remove"
                    aria-label={`Remover ${getInsuranceTypeLabel(item.type)}`}
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <dl className="contract-create-seguro-card__details">
                  <div>
                    <dt>Cobertura</dt>
                    <dd>
                      {item.coverageAmount === ''
                        ? '—'
                        : `R$ ${formatBrCurrency(item.coverageAmount)}`}
                    </dd>
                  </div>
                  <div>
                    <dt>Prêmio mensal</dt>
                    <dd>
                      {item.monthlyPremium === ''
                        ? '—'
                        : `R$ ${formatBrCurrency(item.monthlyPremium)}`}
                    </dd>
                  </div>
                  <div>
                    <dt>Responsável</dt>
                    <dd>
                      {
                        INSURANCE_PAYER_OPTIONS.find(
                          (o) => o.value === item.payer,
                        )?.label
                      }
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        )}
      </FormSection>
    </div>
  )
}
