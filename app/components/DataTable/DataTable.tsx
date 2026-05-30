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
    <div className="records-list-table-wrap">
      <table
        className={[
          "records-list-table",
          tableLayout ? `records-list-table--${tableLayout}` : "",
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
                  `records-list-col--${col.id}`,
                  col.align === "center" ? "records-list-col-center" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {col.headerCell !== undefined ? (
                  col.headerCell
                ) : col.align === "center" ? (
                  <span
                    className={`records-list-col-head records-list-col-head--${col.id}`}
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
              <td colSpan={columns.length} className="records-list-empty">
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
