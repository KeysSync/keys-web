'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { mockImoveis } from '@/lib/mocks/imoveis'
import { getContratoWizardDraft, patchContratoGeralData } from '@/lib/contratos/wizard/draft'
import {
  addMonthsToIsoDate,
  COMISSAO_OPTIONS,
  CONTRATO_TIPO_OPTIONS,
  defaultContratoGeralData,
  FORMA_COBRANCA_OPTIONS,
  INDICE_REAJUSTE_OPTIONS,
  isContratoGeralValid,
  MESES_OPTIONS,
  PARCELAS_OPTIONS,
  type ContratoGeralData,
} from '@/lib/contratos/wizard/geral'
import { CurrencyInputBr } from '@/components/ui/currency-input-br'
import { DateInputBr } from '@/components/ui/date-input-br'
import { IntegerInputBr } from '@/components/ui/integer-input-br'
import { MonthInputBr } from '@/components/ui/month-input-br'
import { PercentInputBr } from '@/components/ui/percent-input-br'
import { ContratoSelect } from '../ContratoSelect'
import { FormDateRange } from './geral/FormDateRange'
import { FormField } from './geral/FormField'
import { FormSection } from './geral/FormSection'

const DESCONTO_MODO_OPTIONS = [
  { value: 'percentual', label: 'Percentual (%)' },
  { value: 'percentual_aluguel', label: '% do aluguel' },
  { value: 'valor', label: 'Valor (R$)' },
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

const inputClass = 'contrato-criar-input'

interface StepGeralProps {
  imovelId: string | null
  onValidityChange?: (valid: boolean) => void
}

export function StepGeral({ imovelId, onValidityChange }: StepGeralProps) {
  const [data, setData] = useState<ContratoGeralData>(() => {
    const draft = getContratoWizardDraft()
    return { ...defaultContratoGeralData(), ...draft.geral }
  })

  const imovel = useMemo(
    () => mockImoveis.find((item) => item.id === imovelId),
    [imovelId],
  )

  useEffect(() => {
    onValidityChange?.(isContratoGeralValid(data))
  }, [data, onValidityChange])

  const didPrefillAluguel = useRef(false)

  useEffect(() => {
    if (!imovel || didPrefillAluguel.current || data.valorAluguel !== '') return
    didPrefillAluguel.current = true
    patch({ valorAluguel: imovel.valorAluguel })
  }, [imovel, data.valorAluguel])

  function patch(partial: Partial<ContratoGeralData>) {
    setData((prev) => {
      let next = { ...prev, ...partial }

      if (
        'inicioContrato' in partial ||
        'duracaoMeses' in partial
      ) {
        const meses =
          typeof next.duracaoMeses === 'number' ? next.duracaoMeses : 0
        next = {
          ...next,
          fimContrato: addMonthsToIsoDate(next.inicioContrato, meses),
        }
      }

      patchContratoGeralData(next)
      onValidityChange?.(isContratoGeralValid(next))
      return next
    })
  }

  function handleNumber(
    key: keyof ContratoGeralData,
    raw: string,
    allowEmpty = false,
  ) {
    if (raw === '' && allowEmpty) {
      patch({ [key]: '' } as Partial<ContratoGeralData>)
      return
    }
    const parsed = Number(raw)
    if (Number.isNaN(parsed)) return
    patch({ [key]: parsed } as Partial<ContratoGeralData>)
  }

  function handleRecalcularProporcional() {
    const valor =
      typeof data.valorAluguel === 'number' ? data.valorAluguel : 0
    patch({ aluguelProporcional: calcProportionalRent(data.inicioContrato, valor) })
  }

  const showComissaoValor = data.comissaoPrimeiroAluguel !== 'nao_tem'
  const showRescisaoMulta = data.possuiMultaRescisao

  return (
    <div className="contrato-criar-step-geral">
      {imovel ? (
        <div className="contrato-criar-geral-imovel">
          <span className="contrato-criar-geral-imovel__label">Imóvel vinculado</span>
          <strong>{imovel.titulo}</strong>
          <span>{imovel.logradouro}</span>
        </div>
      ) : null}

      <FormSection
        title="Dados do contrato"
        description="Vigência, cobrança e identificação interna."
      >
        <div className="contrato-criar-form-grid">
          <FormField label="Tipo de contrato" htmlFor="tipo-contrato">
            <ContratoSelect
              id="tipo-contrato"
              value={data.tipoContrato}
              options={[
                { value: '', label: 'Selecione' },
                ...CONTRATO_TIPO_OPTIONS,
              ]}
              onChange={(v) =>
                patch({ tipoContrato: v as ContratoGeralData['tipoContrato'] })
              }
            />
          </FormField>

          <FormField
            label="Início do contrato"
            htmlFor="inicio-contrato"
            className="contrato-criar-field--date"
          >
            <DateInputBr
              id="inicio-contrato"
              value={data.inicioContrato}
              onChange={(iso) => patch({ inicioContrato: iso })}
            />
          </FormField>

          <FormField label="Duração (meses)" htmlFor="duracao-meses">
            <IntegerInputBr
              id="duracao-meses"
              maxDigits={3}
              value={data.duracaoMeses}
              onChange={(v) => patch({ duracaoMeses: v === '' ? '' : v })}
            />
          </FormField>

          <FormField
            label="Fim do contrato"
            htmlFor="fim-contrato"
            hint="Calculado automaticamente"
            className="contrato-criar-field--date"
          >
            <DateInputBr
              id="fim-contrato"
              className="date-input-br--disabled"
              value={data.fimContrato}
              disabled
            />
          </FormField>

          <FormField label="Renovação automática" htmlFor="renovacao-automatica">
            <label className="contrato-criar-toggle">
              <input
                id="renovacao-automatica"
                type="checkbox"
                checked={data.renovacaoAutomatica}
                onChange={(e) => patch({ renovacaoAutomatica: e.target.checked })}
              />
              <span className="contrato-criar-toggle__track" aria-hidden />
              <span className="contrato-criar-toggle__text">
                {data.renovacaoAutomatica ? 'Ativada' : 'Desativada'}
              </span>
            </label>
          </FormField>

          <FormField label="Duração base (meses)" htmlFor="duracao-base">
            <IntegerInputBr
              id="duracao-base"
              maxDigits={3}
              value={data.duracaoBaseMeses}
              onChange={(v) => patch({ duracaoBaseMeses: v === '' ? '' : v })}
            />
          </FormField>

          <FormDateRange
            startLabel="Assinatura do contrato"
            endLabel="Entrega das chaves"
            startId="assinatura"
            endId="entrega-chaves"
            startValue={data.assinaturaContrato}
            endValue={data.entregaChaves}
            onStartChange={(iso) => patch({ assinaturaContrato: iso })}
            onEndChange={(iso) => patch({ entregaChaves: iso })}
          />

          <FormField
            label="1º vencimento a partir de"
            htmlFor="primeiro-vencimento"
            className="contrato-criar-field--date"
          >
            <DateInputBr
              id="primeiro-vencimento"
              value={data.primeiroVencimentoDe}
              onChange={(iso) => patch({ primeiroVencimentoDe: iso })}
            />
          </FormField>

          <FormField label="Forma de cobrança" htmlFor="forma-cobranca">
            <ContratoSelect
              id="forma-cobranca"
              value={data.formaCobranca}
              options={FORMA_COBRANCA_OPTIONS}
              onChange={(v) =>
                patch({
                  formaCobranca: v as ContratoGeralData['formaCobranca'],
                })
              }
            />
          </FormField>

          <FormField label="Multa (%)" htmlFor="multa">
            <PercentInputBr
              id="multa"
              value={data.multaPercentual}
              onChange={(v) => patch({ multaPercentual: v === '' ? '' : v })}
            />
          </FormField>

          <FormField label="Juros (% ao mês)" htmlFor="juros">
            <PercentInputBr
              id="juros"
              value={data.jurosPercentualMensal}
              onChange={(v) => patch({ jurosPercentualMensal: v === '' ? '' : v })}
            />
          </FormField>

          <FormField label="Código interno" htmlFor="codigo-interno" className="contrato-criar-field--wide">
            <input
              id="codigo-interno"
              type="text"
              className={inputClass}
              placeholder="Ex.: CTR-2026-0042"
              value={data.codigoInterno}
              onChange={(e) => patch({ codigoInterno: e.target.value })}
            />
          </FormField>
        </div>

        <fieldset className="contrato-criar-radio-group">
          <legend>Calcular multa e juros automaticamente?</legend>
          <label className="contrato-criar-radio">
            <input
              type="radio"
              name="multa-juros-auto"
              checked={data.calcularMultaJurosAutomatico}
              onChange={() => patch({ calcularMultaJurosAutomatico: true })}
            />
            Sim
          </label>
          <label className="contrato-criar-radio">
            <input
              type="radio"
              name="multa-juros-auto"
              checked={!data.calcularMultaJurosAutomatico}
              onChange={() => patch({ calcularMultaJurosAutomatico: false })}
            />
            Não
          </label>
        </fieldset>
      </FormSection>

      <FormSection
        title="Reajuste e taxa de administração"
        description="Valores financeiros e índices de correção."
      >
        <div className="contrato-criar-form-grid">
          <FormField label="Mês-base para reajuste" htmlFor="mes-base">
            <ContratoSelect
              id="mes-base"
              value={data.mesBaseReajuste}
              options={[{ value: '', label: 'Selecione' }, ...MESES_OPTIONS]}
              onChange={(v) => patch({ mesBaseReajuste: v })}
            />
          </FormField>

          <FormField label="Índice de reajuste anual" htmlFor="indice-reajuste">
            <ContratoSelect
              id="indice-reajuste"
              value={data.indiceReajusteAnual}
              options={INDICE_REAJUSTE_OPTIONS}
              onChange={(v) =>
                patch({
                  indiceReajusteAnual: v as ContratoGeralData['indiceReajusteAnual'],
                })
              }
            />
          </FormField>

          <FormDateRange
            variant="month"
            startLabel="Próximo reajuste"
            endLabel="Gerar financeiro a partir de"
            startId="proximo-reajuste"
            endId="gerar-financeiro"
            startValue={data.proximoReajuste}
            endValue={data.gerarFinanceiroDe}
            onStartChange={(iso) => patch({ proximoReajuste: iso })}
            onEndChange={(iso) => patch({ gerarFinanceiroDe: iso })}
          />

          <FormField label="Valor do aluguel (R$)" htmlFor="valor-aluguel">
            <CurrencyInputBr
              id="valor-aluguel"
              value={data.valorAluguel}
              onChange={(v) => patch({ valorAluguel: v })}
            />
          </FormField>

          <FormField label="Duração garantida (meses)" htmlFor="garantido-duracao">
            <IntegerInputBr
              id="garantido-duracao"
              maxDigits={3}
              disabled={!data.aluguelGarantido}
              value={data.aluguelGarantidoDuracaoMeses}
              onChange={(v) =>
                patch({ aluguelGarantidoDuracaoMeses: v === '' ? '' : v })
              }
            />
          </FormField>
        </div>

        <fieldset className="contrato-criar-radio-group">
          <legend>Aluguel garantido?</legend>
          <label className="contrato-criar-radio">
            <input
              type="radio"
              name="aluguel-garantido"
              checked={data.aluguelGarantido}
              onChange={() => patch({ aluguelGarantido: true })}
            />
            Sim
          </label>
          <label className="contrato-criar-radio">
            <input
              type="radio"
              name="aluguel-garantido"
              checked={!data.aluguelGarantido}
              onChange={() => patch({ aluguelGarantido: false })}
            />
            Não
          </label>
        </fieldset>

        <div className="contrato-criar-form-grid">
          <FormField label="Taxa de administração">
            <div className="contrato-criar-inline-modes">
              <div className="contrato-criar-segmented contrato-criar-segmented--compact">
                <button
                  type="button"
                  className={`contrato-criar-segmented__btn${data.taxaAdmModo === 'percentual' ? ' contrato-criar-segmented__btn--active' : ''}`}
                  onClick={() => patch({ taxaAdmModo: 'percentual' })}
                >
                  %
                </button>
                <button
                  type="button"
                  className={`contrato-criar-segmented__btn${data.taxaAdmModo === 'valor' ? ' contrato-criar-segmented__btn--active' : ''}`}
                  onClick={() => patch({ taxaAdmModo: 'valor' })}
                >
                  R$
                </button>
              </div>
              {data.taxaAdmModo === 'percentual' ? (
                <PercentInputBr
                  value={data.taxaAdmValor}
                  onChange={(v) => patch({ taxaAdmValor: v })}
                />
              ) : (
                <CurrencyInputBr
                  value={data.taxaAdmValor}
                  onChange={(v) => patch({ taxaAdmValor: v })}
                />
              )}
            </div>
          </FormField>

          <FormField label="Desconto de pontualidade">
            <div className="contrato-criar-inline-modes contrato-criar-inline-modes--stack">
              <ContratoSelect
                value={data.descontoPontualidadeModo}
                options={[...DESCONTO_MODO_OPTIONS]}
                onChange={(v) =>
                  patch({
                    descontoPontualidadeModo:
                      v as ContratoGeralData['descontoPontualidadeModo'],
                  })
                }
              />
              {data.descontoPontualidadeModo === 'valor' ? (
                <CurrencyInputBr
                  value={data.descontoPontualidadeValor}
                  onChange={(v) => patch({ descontoPontualidadeValor: v })}
                />
              ) : (
                <PercentInputBr
                  value={data.descontoPontualidadeValor}
                  onChange={(v) => patch({ descontoPontualidadeValor: v })}
                />
              )}
            </div>
          </FormField>

          <FormField label="Aluguel proporcional (R$)" className="contrato-criar-field--wide">
            <div className="contrato-criar-inline-modes">
              <CurrencyInputBr
                value={data.aluguelProporcional}
                onChange={(v) => patch({ aluguelProporcional: v })}
              />
              <button
                type="button"
                className="contrato-criar-btn-secondary"
                onClick={handleRecalcularProporcional}
              >
                <RefreshCw size={16} />
                Recalcular
              </button>
            </div>
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Comissão do 1º aluguel">
        <div className="contrato-criar-form-grid">
          <FormField label="Comissão" htmlFor="comissao-tipo">
            <ContratoSelect
              id="comissao-tipo"
              value={data.comissaoPrimeiroAluguel}
              options={COMISSAO_OPTIONS}
              onChange={(v) =>
                patch({
                  comissaoPrimeiroAluguel:
                    v as ContratoGeralData['comissaoPrimeiroAluguel'],
                })
              }
            />
          </FormField>

          {showComissaoValor ? (
            <FormField label="Valor" htmlFor="comissao-valor">
              <CurrencyInputBr
                id="comissao-valor"
                value={data.comissaoValor}
                onChange={(v) => patch({ comissaoValor: v })}
              />
            </FormField>
          ) : null}

          {showComissaoValor ? (
            <FormField label="Parcelado em" htmlFor="comissao-parcelas">
              <ContratoSelect
                id="comissao-parcelas"
                value={String(data.comissaoParceladoEm)}
                options={PARCELAS_OPTIONS}
                onChange={(v) => handleNumber('comissaoParceladoEm', v)}
              />
            </FormField>
          ) : null}

          {showComissaoValor ? (
            <FormField
              label="Lançar no mês"
              htmlFor="comissao-mes"
              className="contrato-criar-field--date"
            >
              <MonthInputBr
                id="comissao-mes"
                value={data.comissaoLancarMes}
                onChange={(iso) => patch({ comissaoLancarMes: iso })}
              />
            </FormField>
          ) : null}
        </div>
      </FormSection>

      <FormSection title="Rescisão">
        <fieldset className="contrato-criar-radio-group">
          <legend>Possui multa em rescisão?</legend>
          <label className="contrato-criar-radio">
            <input
              type="radio"
              name="multa-rescisao"
              checked={data.possuiMultaRescisao}
              onChange={() => patch({ possuiMultaRescisao: true })}
            />
            Sim
          </label>
          <label className="contrato-criar-radio">
            <input
              type="radio"
              name="multa-rescisao"
              checked={!data.possuiMultaRescisao}
              onChange={() => patch({ possuiMultaRescisao: false })}
            />
            Não
          </label>
        </fieldset>

        {showRescisaoMulta ? (
          <div className="contrato-criar-form-grid">
            <FormField label="Valor da multa (R$)" htmlFor="multa-rescisao-valor">
              <CurrencyInputBr
                id="multa-rescisao-valor"
                value={data.valorMultaRescisao}
                onChange={(v) => patch({ valorMultaRescisao: v })}
              />
            </FormField>

            <FormField label="Isentar após (meses)" htmlFor="isentar-meses">
              <IntegerInputBr
                id="isentar-meses"
                maxDigits={3}
                value={data.isentarMultaAposMeses}
                onChange={(v) => patch({ isentarMultaAposMeses: v })}
              />
            </FormField>
          </div>
        ) : null}
      </FormSection>

      <FormSection
        title="Condomínio e utilidades"
        description="Informe o que será repassado ou controlado neste contrato."
      >
        <div className="contrato-criar-checklist">
          <label className="contrato-criar-check">
            <input
              type="checkbox"
              checked={data.utilitariosAgua}
              onChange={(e) => patch({ utilitariosAgua: e.target.checked })}
            />
            Água
          </label>
          <label className="contrato-criar-check">
            <input
              type="checkbox"
              checked={data.utilitariosEnergia}
              onChange={(e) => patch({ utilitariosEnergia: e.target.checked })}
            />
            Energia elétrica
          </label>
          <label className="contrato-criar-check">
            <input
              type="checkbox"
              checked={data.utilitariosGas}
              onChange={(e) => patch({ utilitariosGas: e.target.checked })}
            />
            Gás encanado
          </label>
        </div>
      </FormSection>
    </div>
  )
}
