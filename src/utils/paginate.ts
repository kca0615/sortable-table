export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startIndex: number;
    endIndex: number;
  };
}

/**
 * Paginates an array of data
 * @param data Array of data to paginate
 * @param config Pagination configuration
 * @returns Paginated result with data and pagination info
 */
export function paginateData<T>(
  data: T[],
  config: PaginationConfig,
): PaginationResult<T> {
  const { currentPage, pageSize, totalItems } = config;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Ensure current page is within valid bounds
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      currentPage: validCurrentPage,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage: validCurrentPage < totalPages,
      hasPreviousPage: validCurrentPage > 1,
      startIndex: startIndex + 1, // 1-based for display
      endIndex: endIndex,
    },
  };
}

/**
 * Gets the page numbers for pagination controls
 * @param currentPage Current page number
 * @param totalPages Total number of pages
 * @param maxVisible Maximum number of page buttons to show
 * @returns Array of page numbers to display
 */
export function getPageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5,
): number[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + maxVisible - 1);

  // Adjust start if we're near the end
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Navigation helpers for pagination
 */
export const paginationHelpers = {
  goToFirstPage: () => 1,
  goToPreviousPage: (currentPage: number) => Math.max(1, currentPage - 1),
  goToNextPage: (currentPage: number, totalPages: number) =>
    Math.min(totalPages, currentPage + 1),
  goToLastPage: (totalPages: number) => totalPages,
  goToPage: (page: number, totalPages: number) =>
    Math.max(1, Math.min(page, totalPages)),
};
