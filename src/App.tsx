import "./index.css";

import { useEffect, useCallback, useState } from "react";

import type { City, GetCitiesResult } from "./api/getCities";
import { getCities } from "./api/getCities";
import { sortData, sortDataMulti, toggleSortDirection, SortDirection, MultiSortConfig } from "./utils/sort";
import { paginateData } from "./utils/paginate";

import RootLayout from "./features/RootLayout/RootLayout";
import SearchInput from "./components/SearchInput/SearchInput";
import CityTable from "./components/CityTable/CityTable";
import Pagination from "./components/Pagination/Pagination";
import ExportButton from "./components/ExportButton/ExportButton";

const PAGE_SIZE = 10;

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allCities, setAllCities] = useState<City[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  // Sorting state - support both single and multi-sort
  const [sortConfig, setSortConfig] = useState<{
    key: keyof City | null;
    direction: SortDirection;
  }>({
    key: null,
    direction: "none",
  });

  // Multi-sort state
  const [multiSortConfigs, setMultiSortConfigs] = useState<MultiSortConfig<City>[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  const runSearch = useCallback(async (term: string) => {
    setLoading(true);
    setError(null);

    try {
      const result: GetCitiesResult = await getCities({
        searchTerm: term,
        limit: 10000, // Get all results for client-side sorting/pagination
        offset: 0,
      });
      setAllCities(result.cities);
      setCurrentPage(1); // Reset to first page on new search
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("An unexpected error occurred"));
      }
      setAllCities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runSearch(searchTerm);
  }, [runSearch, searchTerm]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleSort = useCallback((key: keyof City, isMultiSort: boolean = false) => {
    if (isMultiSort) {
      // Multi-sort mode: add/update/remove from multi-sort configs
      setMultiSortConfigs((prevConfigs) => {
        const existingIndex = prevConfigs.findIndex(config => config.key === key);

        if (existingIndex >= 0) {
          // Column already in multi-sort, toggle its direction
          const existingConfig = prevConfigs[existingIndex];
          const newDirection = toggleSortDirection(existingConfig.direction);

          if (newDirection === "none") {
            // Remove from multi-sort
            return prevConfigs.filter((_, index) => index !== existingIndex);
          } else {
            // Update direction, keep same priority
            return prevConfigs.map((config, index) =>
              index === existingIndex
                ? { ...config, direction: newDirection }
                : config
            );
          }
        } else {
          // Add new column to multi-sort with lowest priority
          const maxPriority = prevConfigs.length > 0
            ? Math.max(...prevConfigs.map(c => c.priority))
            : -1;

          return [...prevConfigs, {
            key,
            direction: "asc" as SortDirection,
            priority: maxPriority + 1
          }];
        }
      });

      // Clear single sort when using multi-sort
      setSortConfig({ key: null, direction: "none" });
    } else {
      // Single sort mode: clear multi-sort and use single sort
      setMultiSortConfigs([]);
      setSortConfig((prevConfig) => {
        const newDirection =
          prevConfig.key === key
            ? toggleSortDirection(prevConfig.direction)
            : "asc";

        return {
          key: newDirection === "none" ? null : key,
          direction: newDirection,
        };
      });
    }

    setCurrentPage(1); // Reset to first page when sorting
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Apply sorting and pagination
  const sortedCities = (() => {
    if (multiSortConfigs.length > 0) {
      // Use multi-sort
      return sortDataMulti(allCities, multiSortConfigs);
    } else if (sortConfig.key) {
      // Use single sort
      return sortData(allCities, {
        key: sortConfig.key,
        direction: sortConfig.direction,
      });
    } else {
      // No sorting
      return allCities;
    }
  })();

  const paginationResult = paginateData(sortedCities, {
    currentPage,
    pageSize: PAGE_SIZE,
    totalItems: sortedCities.length,
  });

  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-2">
            World Cities Database
          </h1>
          <p className="text-sm sm:text-base text-text-primary">
            Explore and search through major cities worldwide
          </p>
        </header>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-end mb-6">
          <div className="flex-1 w-full">
            <SearchInput onSearch={handleSearch} disabled={loading} />
          </div>
          <div className="flex-shrink-0">
            <ExportButton
              cities={sortedCities}
              disabled={loading}
            />
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center">
              <span className="text-sm sm:text-base text-red-600 dark:text-red-400 font-medium">
                Error: {error.message}
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* Multi-sort instruction */}
            {multiSortConfigs.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Multi-sort active:</strong> {multiSortConfigs.length} column{multiSortConfigs.length !== 1 ? 's' : ''} sorted.
                    Click column headers to modify, or click without Ctrl/Cmd to reset to single sort.
                  </span>
                </div>
              </div>
            )}

            <CityTable
              cities={paginationResult.data}
              sortConfig={sortConfig}
              multiSortConfigs={multiSortConfigs}
              onSort={handleSort}
              loading={loading}
            />

            {!loading && paginationResult.data.length > 0 && (
              <>
                <Pagination
                  currentPage={paginationResult.pagination.currentPage}
                  totalPages={paginationResult.pagination.totalPages}
                  totalItems={paginationResult.pagination.totalItems}
                  pageSize={PAGE_SIZE}
                  onPageChange={handlePageChange}
                  startIndex={paginationResult.pagination.startIndex}
                  endIndex={paginationResult.pagination.endIndex}
                />

                {/* Multi-sort help text */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    💡 <strong>Tip:</strong> Hold Ctrl/Cmd while clicking column headers to sort by multiple columns
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </RootLayout>
  );
};

export default App;
