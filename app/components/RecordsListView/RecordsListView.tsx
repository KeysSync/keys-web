"use client";

import {
  DataTableList,
  type DataTableColumn,
  type DataTableLayout,
} from "@/app/components/DataTable";

export type RecordsColumn<T> = DataTableColumn<T>;
export type RecordsTableLayout = Extract<
  DataTableLayout,
  "properties" | "people" | "members"
>;

export type RecordsListViewProps<T> = {
  entityName: string;
  newButtonLabel: string;
  searchPlaceholder: string;
  rows: T[];
  columns: RecordsColumn<T>[];
  filterRow: (row: T, query: string) => boolean;
  getRowKey: (row: T) => string;
  tableLayout?: RecordsTableLayout;
  pageSize?: number;
  pagination?: boolean;
  emptyMessage?: string;
  isRowSelected?: (row: T) => boolean;
  onRowClick?: (row: T) => void;
  onRowDoubleClick?: (row: T) => void;
  onNewClick?: () => void;
  toolbarExtra?: React.ReactNode;
};

export function RecordsListView<T>(props: RecordsListViewProps<T>) {
  return <DataTableList {...props} />;
}

// Re-export for gradual migration
export type { DataTableColumn, DataTableLayout } from "@/app/components/DataTable";
