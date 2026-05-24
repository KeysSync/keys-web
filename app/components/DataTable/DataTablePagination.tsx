"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type DataTablePaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  entityName: string;
  onPageChange: (page: number) => void;
};

function getPageNumbers(page: number, totalPages: number): number[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  return Array.from({ length: 5 }, (_, index) => start + index);
}

export function DataTablePagination({
  page,
  pageSize,
  totalItems,
  entityName,
  onPageChange,
}: DataTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="data-table-pagination">
      <p className="data-table-pagination__summary">
        {totalItems === 0
          ? `0 ${entityName}`
          : `Mostrando ${startItem}-${endItem} de ${totalItems} ${entityName}`}
      </p>

      <nav className="data-table-pagination__nav" aria-label="Paginação da tabela">
        <button
          type="button"
          className="data-table-pagination__control"
          aria-label="Página anterior"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} aria-hidden />
        </button>

        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={`data-table-pagination__page${
              pageNumber === currentPage ? " data-table-pagination__page--active" : ""
            }`}
            aria-current={pageNumber === currentPage ? "page" : undefined}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          className="data-table-pagination__control"
          aria-label="Próxima página"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={16} aria-hidden />
        </button>
      </nav>
    </div>
  );
}
