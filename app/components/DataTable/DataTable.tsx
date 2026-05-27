"use client";

import { DataTableRow } from "./DataTableRow";
import type { DataTableColumn, DataTableLayout } from "./types";

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  tableLayout?: DataTableLayout;
  emptyMessage?: string;
  isRowSelected?: (row: T) => boolean;
  onRowClick?: (row: T) => void;
  onRowDoubleClick?: (row: T) => void;
};

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  tableLayout,
  emptyMessage = "Nenhum registro encontrado.",
  isRowSelected,
  onRowClick,
  onRowDoubleClick,
}: DataTableProps<T>) {
  return (
    <div className="cadastros-list-table-wrap">
      <table
        className={[
          "cadastros-list-table",
          tableLayout ? `cadastros-list-table--${tableLayout}` : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.id}
                className={[
                  `cadastros-list-col--${col.id}`,
                  col.align === "center" ? "cadastros-list-col-center" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {col.headerCell !== undefined ? (
                  col.headerCell
                ) : col.align === "center" ? (
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
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="cadastros-list-empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <DataTableRow
                key={getRowKey(row)}
                row={row}
                columns={columns}
                selected={isRowSelected?.(row) ?? false}
                selectable={Boolean(onRowClick)}
                onRowClick={onRowClick}
                onRowDoubleClick={onRowDoubleClick}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
