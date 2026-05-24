'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { Plus, Search } from 'lucide-react'

export type CadastrosColumn<T> = {
  id: string
  header: string
  cell: (row: T) => ReactNode
  align?: 'left' | 'center'
}

export type CadastrosTableLayout = 'imoveis' | 'pessoas'

interface CadastrosListViewProps<T> {
  entityName: string
  newButtonLabel: string
  searchPlaceholder: string
  rows: T[]
  columns: CadastrosColumn<T>[]
  filterRow: (row: T, query: string) => boolean
  getRowKey: (row: T) => string
  tableLayout?: CadastrosTableLayout
}

export function CadastrosListView<T>({
  entityName,
  newButtonLabel,
  searchPlaceholder,
  rows,
  columns,
  filterRow,
  getRowKey,
  tableLayout,
}: CadastrosListViewProps<T>) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) => filterRow(row, q))
  }, [rows, search, filterRow])

  return (
    <section className="cadastros-list">
      <div className="cadastros-list-toolbar">
        <label className="cadastros-list-search">
          <Search size={18} className="cadastros-list-search-icon" aria-hidden />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="cadastros-list-search-input"
          />
        </label>
        <button type="button" className="cadastros-list-btn-primary">
          <Plus size={18} />
          {newButtonLabel}
        </button>
      </div>

      <div className="cadastros-list-panel">
        <div className="cadastros-list-table-wrap">
          <table
            className={[
              'cadastros-list-table',
              tableLayout ? `cadastros-list-table--${tableLayout}` : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.id}
                    className={[
                      `cadastros-list-col--${col.id}`,
                      col.align === 'center' ? 'cadastros-list-col-center' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {col.align === 'center' ? (
                      <span
                        className={`cadastros-list-col-head cadastros-list-col-head--${col.id}`}
                      >
                        {col.header}
                      </span>
                    ) : (
                      col.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="cadastros-list-empty">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={getRowKey(row)}>
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className={[
                          `cadastros-list-col--${col.id}`,
                          col.align === 'center' ? 'cadastros-list-col-center' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {col.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="cadastros-list-footer">
          <p>
            {filtered.length === rows.length
              ? `${rows.length} ${entityName}`
              : `Mostrando ${filtered.length} de ${rows.length} ${entityName}`}
          </p>
        </footer>
      </div>
    </section>
  )
}
