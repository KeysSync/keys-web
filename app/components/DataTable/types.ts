import type { ReactNode } from "react";

export type DataTableColumn<T> = {
  id: string;
  header?: string;
  headerCell?: ReactNode;
  cell: (row: T) => ReactNode;
  align?: "left" | "center";
};

export type DataTableLayout =
  | "imoveis"
  | "pessoas"
  | "membros"
  | "cargos";
