'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { getContractWizardDraft, patchContractEntriesData } from '@/lib/contracts/wizard/draft'
import {
  createEntryItem,
  defaultContractEntriesData,
  ENTRY_RESPONSIBLE_OPTIONS,
  ENTRY_TYPE_OPTIONS,
  type ContractEntryItem,
  type ContractEntriesData,
  type EntryResponsibleParty,
  type EntryType,
} from '@/lib/contracts/wizard/entries'
import { CurrencyInputBr } from '@/components/ui/currency-input-br'
import { ContractSelect } from '@/app/components/ContractSelect/ContractSelect'
import { FormSection } from '@/app/components/FormSection/FormSection'

const inputClass = 'contract-create-input'

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function StepEntries() {
  const [data, setData] = useState<ContractEntriesData>(() => {
    const draft = getContractWizardDraft()
    return {
      ...defaultContractEntriesData(),
      items: draft.entries?.items ?? [],
    }
  })
  const didPrefill = useRef(false)

  function persist(next: ContractEntriesData) {
    setData(next)
    patchContractEntriesData(next)
  }

  useEffect(() => {
    if (didPrefill.current || data.items.length > 0) return
    const draft = getContractWizardDraft()
    const rentAmount =
      typeof draft.general.rentAmount === 'number' ? draft.general.rentAmount : 0
    if (!rentAmount) return
    didPrefill.current = true
    persist({
      items: [
        createEntryItem({
          type: 'rent',
          description: 'Aluguel mensal',
          amount: rentAmount,
          responsibleParty: 'tenant',
          recurring: true,
        }),
      ],
    })
  }, [data.items.length])

  function patchItem(id: string, partial: Partial<ContractEntryItem>) {
    persist({
      items: data.items.map((item) =>
        item.id === id ? { ...item, ...partial } : item,
      ),
    })
  }

  function addItem() {
    persist({ items: [...data.items, createEntryItem()] })
  }

  function removeItem(id: string) {
    persist({ items: data.items.filter((item) => item.id !== id) })
  }

  const totalMensal = useMemo(
    () =>
      data.items.reduce((sum, item) => {
        if (!item.recurring) return sum
        return sum + (typeof item.amount === 'number' ? item.amount : 0)
      }, 0),
    [data.items],
  )

  return (
    <div className="contract-create-step-form">
      <FormSection
        title="Lançamentos do contrato"
        description="Configure cobranças e repasses recorrentes ou avulsos."
      >
        <div className="contract-create-lancamentos-toolbar">
          <p className="contract-create-results-meta">
            Total recorrente estimado: <strong>{formatCurrency(totalMensal)}</strong>
          </p>
          <button type="button" className="contract-create-btn-ghost" onClick={addItem}>
            <Plus size={18} />
            Adicionar lançamento
          </button>
        </div>

        {data.items.length === 0 ? (
          <div className="contract-create-locatarios-empty">
            <p>Nenhum lançamento configurado.</p>
            <span>Adicione aluguel, condomínio, IPTU e demais itens.</span>
          </div>
        ) : (
          <ul className="contract-create-lancamentos-list">
            {data.items.map((item) => (
              <li key={item.id} className="contract-create-lancamento-row">
                <div className="contract-create-lancamento-row__grid">
                  <label className="contract-create-lancamento-field">
                    <span>Tipo</span>
                    <ContractSelect
                      value={item.type}
                      options={ENTRY_TYPE_OPTIONS}
                      onChange={(v) =>
                        patchItem(item.id, { type: v as EntryType })
                      }
                    />
                  </label>

                  <label className="contract-create-lancamento-field contract-create-lancamento-field--wide">
                    <span>Descrição</span>
                    <input
                      type="text"
                      className={inputClass}
                      value={item.description}
                      onChange={(e) =>
                        patchItem(item.id, { description: e.target.value })
                      }
                    />
                  </label>

                  <label className="contract-create-lancamento-field">
                    <span>Valor (R$)</span>
                    <CurrencyInputBr
                      value={item.amount}
                      onChange={(v) => patchItem(item.id, { amount: v })}
                    />
                  </label>

                  <label className="contract-create-lancamento-field">
                    <span>Responsável</span>
                    <ContractSelect
                      value={item.responsibleParty}
                      options={ENTRY_RESPONSIBLE_OPTIONS}
                      onChange={(v) =>
                        patchItem(item.id, {
                          responsibleParty: v as EntryResponsibleParty,
                        })
                      }
                    />
                  </label>

                  <label className="contract-create-check contract-create-lancamento-field--check">
                    <input
                      type="checkbox"
                      checked={item.recurring}
                      onChange={(e) =>
                        patchItem(item.id, { recurring: e.target.checked })
                      }
                    />
                    Recorrente
                  </label>
                </div>

                <button
                  type="button"
                  className="contract-create-lancamento-row__remove"
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
