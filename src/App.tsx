import "./index.css";

import { useEffect, useCallback, useState } from "react";

import type { City, GetCitiesResult } from "./api/getCities";
import { getCities } from "./api/getCities";
import { sortData, toggleSortDirection, SortDirection } from "./utils/sort";
import { paginateData } from "./utils/paginate";

import RootLayout from "./features/RootLayout/RootLayout";
import SearchInput from "./components/SearchInput/SearchInput";
import CityTable from "./components/CityTable/CityTable";
import Pagination from "./components/Pagination/Pagination";

const PAGE_SIZE = 10;

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allCities, setAllCities] = useState<City[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: keyof City | null;
    direction: SortDirection;
  }>({
    key: null,
    direction: "none",
  });

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

  const handleSort = useCallback((key: keyof City) => {
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
    setCurrentPage(1); // Reset to first page when sorting
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Apply sorting and pagination
  const sortedCities = sortConfig.key
    ? sortData(allCities, {
        key: sortConfig.key,
        direction: sortConfig.direction,
      })
    : allCities;

  const paginationResult = paginateData(sortedCities, {
    currentPage,
    pageSize: PAGE_SIZE,
    totalItems: sortedCities.length,
  });

  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            World Cities Database
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Explore and search through major cities worldwide
          </p>
        </header>

        <SearchInput onSearch={handleSearch} disabled={loading} />

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
            <CityTable
              cities={paginationResult.data}
              sortConfig={sortConfig}
              onSort={handleSort}
              loading={loading}
            />

            {!loading && paginationResult.data.length > 0 && (
              <Pagination
                currentPage={paginationResult.pagination.currentPage}
                totalPages={paginationResult.pagination.totalPages}
                totalItems={paginationResult.pagination.totalItems}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
                startIndex={paginationResult.pagination.startIndex}
                endIndex={paginationResult.pagination.endIndex}
              />
            )}
          </>
        )}
      </div>
    </RootLayout>
  );
};

export default App;
