"use client";

import type { MouseEvent } from "react";
import type { DataTableColumn } from "./types";

type DataTableRowProps<T> = {
  row: T;
  columns: DataTableColumn<T>[];
  selected?: boolean;
  selectable?: boolean;
  onRowClick?: (row: T) => void;
};

export function DataTableRow<T>({
  row,
  columns,
  selected = false,
  selectable = false,
  onRowClick,
}: DataTableRowProps<T>) {
  const handleClick = (event: MouseEvent<HTMLTableRowElement>) => {
    if (!onRowClick) return;

    const target = event.target as HTMLElement;
    if (target.closest("button, label, input, a")) return;

    onRowClick(row);
  };

  return (
    <tr
      className={[
        selectable ? "cadastros-list-row--selectable" : "",
        selected ? "cadastros-list-row--selected" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onRowClick ? handleClick : undefined}
    >
      {columns.map((col) => (
        <td
          key={col.id}
          className={[
            `cadastros-list-col--${col.id}`,
            col.align === "center" ? "cadastros-list-col-center" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {col.cell(row)}
        </td>
      ))}
    </tr>
  );
}
