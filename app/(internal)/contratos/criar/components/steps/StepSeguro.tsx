'use client'

import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { getContratoWizardDraft, patchContratoSeguroData } from '@/lib/contratos/wizard/draft'
import {
  createSeguroItem,
  defaultContratoSegurosData,
  getTipoSeguroLabel,
  SEGURO_RESPONSAVEL_OPTIONS,
  TIPO_SEGURO_OPTIONS,
  type ContratoSegurosData,
  type SeguroResponsavelPagamento,
  type TipoSeguro,
} from '@/lib/contratos/wizard/seguro'
import { CurrencyInputBr } from '@/components/ui/currency-input-br'
import { MaskedTextInputBr } from '@/components/ui/masked-text-input-br'
import { formatBrCurrency } from '@/lib/format/br'
import { ContratoSelect } from '../ContratoSelect'
import { FormDateRange } from './geral/FormDateRange'
import { FormField } from './geral/FormField'
import { FormSection } from './geral/FormSection'

const inputClass = 'contrato-criar-input'

export function StepSeguro() {
  const [data, setData] = useState<ContratoSegurosData>(() => {
    const draft = getContratoWizardDraft()
    return { ...defaultContratoSegurosData(), ...draft.seguro }
  })

  const tipoAtivo = TIPO_SEGURO_OPTIONS.find((o) => o.value === data.tipoMenu)

  function persist(next: ContratoSegurosData) {
    setData(next)
    patchContratoSeguroData(next)
  }

  function patchRascunho(partial: Partial<ContratoSegurosData['rascunho']>) {
    persist({ ...data, rascunho: { ...data.rascunho, ...partial } })
  }

  function selectTipoMenu(tipo: TipoSeguro) {
    persist({ ...data, tipoMenu: tipo })
  }

  function addSeguro() {
    const item = createSeguroItem(data.tipoMenu, data.rascunho)
    persist({
      ...data,
      itens: [...data.itens, item],
      rascunho: defaultContratoSegurosData().rascunho,
    })
  }

  function removeItem(id: string) {
    persist({ ...data, itens: data.itens.filter((i) => i.id !== id) })
  }

  return (
    <div className="contrato-criar-step-form">
      <FormSection
        title="Modalidade"
        description="Escolha o tipo de seguro e preencha os dados da apólice."
      >
        <nav
          className="contrato-criar-segmented contrato-criar-segmented--wrap contrato-criar-seguros-submenu"
          role="tablist"
          aria-label="Tipo de seguro"
        >
          {TIPO_SEGURO_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={data.tipoMenu === opt.value}
              className={`contrato-criar-segmented__btn${data.tipoMenu === opt.value ? ' contrato-criar-segmented__btn--active' : ''}`}
              onClick={() => selectTipoMenu(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </nav>

        {tipoAtivo ? (
          <p className="contrato-criar-seguros-submenu__hint">{tipoAtivo.descricao}</p>
        ) : null}

        <div className="contrato-criar-form-grid">
          <FormField label="Seguradora" htmlFor="seguradora">
            <input
              id="seguradora"
              type="text"
              className={inputClass}
              value={data.rascunho.seguradora}
              onChange={(e) => patchRascunho({ seguradora: e.target.value })}
              placeholder="Nome da seguradora"
            />
          </FormField>

          <FormField label="Número da apólice" htmlFor="apolice">
            <MaskedTextInputBr
              id="apolice"
              mask="policy"
              value={data.rascunho.apolice}
              onChange={(v) => patchRascunho({ apolice: v })}
            />
          </FormField>

          <FormField label="Valor de cobertura (R$)" htmlFor="cobertura">
            <CurrencyInputBr
              id="cobertura"
              value={data.rascunho.coberturaValor}
              onChange={(v) => patchRascunho({ coberturaValor: v })}
            />
          </FormField>

          <FormField label="Prêmio mensal (R$)" htmlFor="premio">
            <CurrencyInputBr
              id="premio"
              value={data.rascunho.premioMensal}
              onChange={(v) => patchRascunho({ premioMensal: v })}
            />
          </FormField>

          <FormDateRange
            startLabel="Vigência — início"
            endLabel="Vigência — fim"
            startId="seguro-inicio"
            endId="seguro-fim"
            startValue={data.rascunho.vigenciaInicio}
            endValue={data.rascunho.vigenciaFim}
            onStartChange={(iso) => patchRascunho({ vigenciaInicio: iso })}
            onEndChange={(iso) => patchRascunho({ vigenciaFim: iso })}
          />

          <FormField label="Quem paga o prêmio" htmlFor="seguro-responsavel">
            <ContratoSelect
              id="seguro-responsavel"
              value={data.rascunho.responsavelPagamento}
              options={SEGURO_RESPONSAVEL_OPTIONS}
              onChange={(v) =>
                patchRascunho({
                  responsavelPagamento: v as SeguroResponsavelPagamento,
                })
              }
            />
          </FormField>
        </div>

        <FormField label="Observações" htmlFor="seguro-obs">
          <textarea
            id="seguro-obs"
            className="contrato-criar-textarea"
            rows={2}
            value={data.rascunho.observacoes}
            onChange={(e) => patchRascunho({ observacoes: e.target.value })}
          />
        </FormField>

        <div className="contrato-criar-seguros-actions">
          <button type="button" className="contrato-criar-btn-ghost" onClick={addSeguro}>
            <Plus size={18} />
            Incluir {getTipoSeguroLabel(data.tipoMenu).toLowerCase()}
          </button>
        </div>
      </FormSection>

      <FormSection
        title="Seguros do contrato"
        description="Apólices já vinculadas a este cadastro."
      >
        {data.itens.length === 0 ? (
          <div className="contrato-criar-locatarios-empty">
            <p>Nenhum seguro incluído.</p>
            <span>Use o submenu acima para escolher a modalidade e incluir a apólice.</span>
          </div>
        ) : (
          <ul className="contrato-criar-seguros-list">
            {data.itens.map((item) => (
              <li key={item.id} className="contrato-criar-seguro-card">
                <div className="contrato-criar-seguro-card__head">
                  <div>
                    <strong>{getTipoSeguroLabel(item.tipo)}</strong>
                    {item.seguradora ? (
                      <span className="contrato-criar-seguro-card__meta">
                        {item.seguradora}
                        {item.apolice ? ` · Apólice ${item.apolice}` : ''}
                      </span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="contrato-criar-lancamento-row__remove"
                    aria-label={`Remover ${getTipoSeguroLabel(item.tipo)}`}
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <dl className="contrato-criar-seguro-card__details">
                  <div>
                    <dt>Cobertura</dt>
                    <dd>
                      {item.coberturaValor === ''
                        ? '—'
                        : `R$ ${formatBrCurrency(item.coberturaValor)}`}
                    </dd>
                  </div>
                  <div>
                    <dt>Prêmio mensal</dt>
                    <dd>
                      {item.premioMensal === ''
                        ? '—'
                        : `R$ ${formatBrCurrency(item.premioMensal)}`}
                    </dd>
                  </div>
                  <div>
                    <dt>Responsável</dt>
                    <dd>
                      {
                        SEGURO_RESPONSAVEL_OPTIONS.find(
                          (o) => o.value === item.responsavelPagamento,
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
