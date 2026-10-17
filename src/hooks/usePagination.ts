import { useMemo, useState } from "react";

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
}

export function usePagination<T>(items: T[], options: UsePaginationOptions = {}) {
  const { initialPage = 1, initialPageSize = 10 } = options;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  return {
    currentPage: safePage,
    pageSize,
    totalPages,
    totalItems: items.length,
    paginatedItems,
    setCurrentPage,
    setPageSize,
    nextPage: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
    prevPage: () => setCurrentPage((p) => Math.max(1, p - 1)),
  };
}
