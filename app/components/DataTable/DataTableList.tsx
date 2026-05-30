"use client";

import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "./DataTable";
import { DataTablePagination } from "./DataTablePagination";
import type { DataTableColumn, DataTableLayout } from "./types";
import "./style.css";

export type DataTableListProps<T> = {
  entityName: string;
  newButtonLabel: string;
  searchPlaceholder: string;
  rows: T[];
  columns: DataTableColumn<T>[];
  filterRow: (row: T, query: string) => boolean;
  getRowKey: (row: T) => string;
  tableLayout?: DataTableLayout;
  pageSize?: number;
  pagination?: boolean;
  emptyMessage?: string;
  isRowSelected?: (row: T) => boolean;
  onRowClick?: (row: T) => void;
  onRowDoubleClick?: (row: T) => void;
  onNewClick?: () => void;
  toolbarExtra?: React.ReactNode;
};

export function DataTableList<T>({
  entityName,
  newButtonLabel,
  searchPlaceholder,
  rows,
  columns,
  filterRow,
  getRowKey,
  tableLayout,
  pageSize = 10,
  pagination = true,
  emptyMessage,
  isRowSelected,
  onRowClick,
  onRowDoubleClick,
  onNewClick,
  toolbarExtra,
}: DataTableListProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) => filterRow(row, query));
  }, [rows, search, filterRow]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedRows = useMemo(() => {
    if (!pagination) return filtered;
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, pagination, currentPage, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, rows.length, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <section className="records-list">
      <div className="records-list-toolbar">
        <label className="records-list-search">
          <Search size={18} className="records-list-search-icon" aria-hidden />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            className="records-list-search-input"
          />
        </label>
        <div className="records-list-toolbar-actions">
          {toolbarExtra}
          <button
            type="button"
            className="records-list-btn-primary"
            onClick={onNewClick}
          >
            <Plus size={18} />
            {newButtonLabel}
          </button>
        </div>
      </div>

      <div className="records-list-panel">
        <DataTable
          columns={columns}
          rows={paginatedRows}
          getRowKey={getRowKey}
          tableLayout={tableLayout}
          emptyMessage={emptyMessage}
          isRowSelected={isRowSelected}
          onRowClick={onRowClick}
          onRowDoubleClick={onRowDoubleClick}
        />

        <footer className="records-list-footer">
          {pagination ? (
            <DataTablePagination
              page={currentPage}
              pageSize={pageSize}
              totalItems={filtered.length}
              entityName={entityName}
              onPageChange={setPage}
            />
          ) : (
            <p>
              {filtered.length === rows.length
                ? `${rows.length} ${entityName}`
                : `Mostrando ${filtered.length} de ${rows.length} ${entityName}`}
            </p>
          )}
        </footer>
      </div>
    </section>
  );
}
