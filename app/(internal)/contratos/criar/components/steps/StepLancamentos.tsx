'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { getContratoWizardDraft, patchContratoLancamentosData } from '@/lib/contratos/wizard/draft'
import {
  createLancamentoItem,
  defaultContratoLancamentosData,
  LANCAMENTO_RESPONSAVEL_OPTIONS,
  LANCAMENTO_TIPO_OPTIONS,
  type ContratoLancamentoItem,
  type ContratoLancamentosData,
  type LancamentoResponsavel,
  type LancamentoTipo,
} from '@/lib/contratos/wizard/lancamentos'
import { CurrencyInputBr } from '@/components/ui/currency-input-br'
import { ContratoSelect } from '../ContratoSelect'
import { FormSection } from './geral/FormSection'

const inputClass = 'contrato-criar-input'

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function StepLancamentos() {
  const [data, setData] = useState<ContratoLancamentosData>(() => {
    const draft = getContratoWizardDraft()
    return {
      ...defaultContratoLancamentosData(),
      itens: draft.lancamentos?.itens ?? [],
    }
  })
  const didPrefill = useRef(false)

  function persist(next: ContratoLancamentosData) {
    setData(next)
    patchContratoLancamentosData(next)
  }

  useEffect(() => {
    if (didPrefill.current || data.itens.length > 0) return
    const draft = getContratoWizardDraft()
    const valor =
      typeof draft.geral.valorAluguel === 'number' ? draft.geral.valorAluguel : 0
    if (!valor) return
    didPrefill.current = true
    persist({
      itens: [
        createLancamentoItem({
          tipo: 'aluguel',
          descricao: 'Aluguel mensal',
          valor,
          responsavel: 'locatario',
          recorrente: true,
        }),
      ],
    })
  }, [data.itens.length])

  function patchItem(id: string, partial: Partial<ContratoLancamentoItem>) {
    persist({
      itens: data.itens.map((item) =>
        item.id === id ? { ...item, ...partial } : item,
      ),
    })
  }

  function addItem() {
    persist({ itens: [...data.itens, createLancamentoItem()] })
  }

  function removeItem(id: string) {
    persist({ itens: data.itens.filter((item) => item.id !== id) })
  }

  const totalMensal = useMemo(
    () =>
      data.itens.reduce((sum, item) => {
        if (!item.recorrente) return sum
        return sum + (typeof item.valor === 'number' ? item.valor : 0)
      }, 0),
    [data.itens],
  )

  return (
    <div className="contrato-criar-step-form">
      <FormSection
        title="Lançamentos do contrato"
        description="Configure cobranças e repasses recorrentes ou avulsos."
      >
        <div className="contrato-criar-lancamentos-toolbar">
          <p className="contrato-criar-results-meta">
            Total recorrente estimado: <strong>{formatCurrency(totalMensal)}</strong>
          </p>
          <button type="button" className="contrato-criar-btn-ghost" onClick={addItem}>
            <Plus size={18} />
            Adicionar lançamento
          </button>
        </div>

        {data.itens.length === 0 ? (
          <div className="contrato-criar-locatarios-empty">
            <p>Nenhum lançamento configurado.</p>
            <span>Adicione aluguel, condomínio, IPTU e demais itens.</span>
          </div>
        ) : (
          <ul className="contrato-criar-lancamentos-list">
            {data.itens.map((item) => (
              <li key={item.id} className="contrato-criar-lancamento-row">
                <div className="contrato-criar-lancamento-row__grid">
                  <label className="contrato-criar-lancamento-field">
                    <span>Tipo</span>
                    <ContratoSelect
                      value={item.tipo}
                      options={LANCAMENTO_TIPO_OPTIONS}
                      onChange={(v) =>
                        patchItem(item.id, { tipo: v as LancamentoTipo })
                      }
                    />
                  </label>

                  <label className="contrato-criar-lancamento-field contrato-criar-lancamento-field--wide">
                    <span>Descrição</span>
                    <input
                      type="text"
                      className={inputClass}
                      value={item.descricao}
                      onChange={(e) =>
                        patchItem(item.id, { descricao: e.target.value })
                      }
                    />
                  </label>

                  <label className="contrato-criar-lancamento-field">
                    <span>Valor (R$)</span>
                    <CurrencyInputBr
                      value={item.valor}
                      onChange={(v) => patchItem(item.id, { valor: v })}
                    />
                  </label>

                  <label className="contrato-criar-lancamento-field">
                    <span>Responsável</span>
                    <ContratoSelect
                      value={item.responsavel}
                      options={LANCAMENTO_RESPONSAVEL_OPTIONS}
                      onChange={(v) =>
                        patchItem(item.id, {
                          responsavel: v as LancamentoResponsavel,
                        })
                      }
                    />
                  </label>

                  <label className="contrato-criar-check contrato-criar-lancamento-field--check">
                    <input
                      type="checkbox"
                      checked={item.recorrente}
                      onChange={(e) =>
                        patchItem(item.id, { recorrente: e.target.checked })
                      }
                    />
                    Recorrente
                  </label>
                </div>

                <button
                  type="button"
                  className="contrato-criar-lancamento-row__remove"
                  onClick={() => removeItem(item.id)}
                  aria-label="Remover lançamento"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </FormSection>
    </div>
  )
}
