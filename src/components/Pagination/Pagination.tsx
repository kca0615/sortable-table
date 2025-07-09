import React from "react";
import { paginationHelpers } from "../../utils/paginate";
import styles from "./Pagination.module.css";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  startIndex: number;
  endIndex: number;
}

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  startIndex,
  endIndex,
}: PaginationProps) {
  const handleFirstPage = () => {
    onPageChange(paginationHelpers.goToFirstPage());
  };

  const handlePreviousPage = () => {
    onPageChange(paginationHelpers.goToPreviousPage(currentPage));
  };

  const handleNextPage = () => {
    onPageChange(paginationHelpers.goToNextPage(currentPage, totalPages));
  };

  const handleLastPage = () => {
    onPageChange(paginationHelpers.goToLastPage(totalPages));
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <nav
      className={styles.pagination}
      role="navigation"
      aria-label="Pagination navigation"
    >
      <div className={styles.info}>
        <span className={styles.infoText}>
          Showing {startIndex} to {endIndex} of {totalItems.toLocaleString()}{" "}
          results
        </span>
      </div>

      <div className={styles.controls}>
        <button
          className={`${styles.button} ${styles.controlButton}`}
          onClick={handleFirstPage}
          onKeyDown={(e) => handleKeyDown(e, handleFirstPage)}
          disabled={currentPage === 1}
          aria-label="Go to first page"
          title="First page"
        >
          <span className={styles.buttonIcon}>⏮</span>
          <span className={styles.buttonText}>First</span>
        </button>

        <button
          className={`${styles.button} ${styles.controlButton}`}
          onClick={handlePreviousPage}
          onKeyDown={(e) => handleKeyDown(e, handlePreviousPage)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
          title="Previous page"
        >
          <span className={styles.buttonIcon}>◀</span>
          <span className={styles.buttonText}>Previous</span>
        </button>

        <div className={styles.pageInfo}>
          <span className={styles.pageText}>
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <button
          className={`${styles.button} ${styles.controlButton}`}
          onClick={handleNextPage}
          onKeyDown={(e) => handleKeyDown(e, handleNextPage)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
          title="Next page"
        >
          <span className={styles.buttonText}>Next</span>
          <span className={styles.buttonIcon}>▶</span>
        </button>

        <button
          className={`${styles.button} ${styles.controlButton}`}
          onClick={handleLastPage}
          onKeyDown={(e) => handleKeyDown(e, handleLastPage)}
          disabled={currentPage === totalPages}
          aria-label="Go to last page"
          title="Last page"
        >
          <span className={styles.buttonText}>Last</span>
          <span className={styles.buttonIcon}>⏭</span>
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
