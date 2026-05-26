"use client";

import {
  DataTableList,
  type DataTableColumn,
  type DataTableLayout,
} from "@/app/components/DataTable";

export type CadastrosColumn<T> = DataTableColumn<T>;
export type CadastrosTableLayout = Extract<
  DataTableLayout,
  "imoveis" | "pessoas" | "membros"
>;

export type CadastrosListViewProps<T> = {
  entityName: string;
  newButtonLabel: string;
  searchPlaceholder: string;
  rows: T[];
  columns: CadastrosColumn<T>[];
  filterRow: (row: T, query: string) => boolean;
  getRowKey: (row: T) => string;
  tableLayout?: CadastrosTableLayout;
  pageSize?: number;
  pagination?: boolean;
  isRowSelected?: (row: T) => boolean;
  onRowClick?: (row: T) => void;
  onNewClick?: () => void;
};

export function CadastrosListView<T>(props: CadastrosListViewProps<T>) {
  return <DataTableList {...props} />;
}

// Re-export for gradual migration
export type { DataTableColumn, DataTableLayout } from "@/app/components/DataTable";
