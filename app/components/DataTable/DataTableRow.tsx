"use client";

import type { MouseEvent } from "react";
import type { DataTableColumn } from "./types";

type DataTableRowProps<T> = {
  row: T;
  columns: DataTableColumn<T>[];
  selected?: boolean;
  selectable?: boolean;
  onRowClick?: (row: T) => void;
  onRowDoubleClick?: (row: T) => void;
};

export function DataTableRow<T>({
  row,
  columns,
  selected = false,
  selectable = false,
  onRowClick,
  onRowDoubleClick,
}: DataTableRowProps<T>) {
  const isInteractive = (event: MouseEvent<HTMLTableRowElement>) => {
    const target = event.target as HTMLElement;
    return target.closest("button, label, input, a");
  };

  const handleClick = (event: MouseEvent<HTMLTableRowElement>) => {
    if (!onRowClick || isInteractive(event)) return;
    onRowClick(row);
  };

  const handleDoubleClick = (event: MouseEvent<HTMLTableRowElement>) => {
    if (!onRowDoubleClick || isInteractive(event)) return;
    onRowDoubleClick(row);
  };

  return (
    <tr
      className={[
        selectable || onRowDoubleClick ? "cadastros-list-row--selectable" : "",
        selected ? "cadastros-list-row--selected" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onRowClick ? handleClick : undefined}
      onDoubleClick={onRowDoubleClick ? handleDoubleClick : undefined}
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
