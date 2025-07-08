import React from "react";
import type { City } from "../../api/getCities";
import { SortDirection, getAriaSortValue, MultiSortConfig } from "../../utils/sort";
import styles from "./CityTable.module.css";

export interface CityTableProps {
  cities: City[];
  sortConfig: {
    key: keyof City | null;
    direction: SortDirection;
  };
  multiSortConfigs?: MultiSortConfig<City>[];
  onSort: (key: keyof City, isMultiSort?: boolean) => void;
  loading?: boolean;
}

const CityTable: React.FC<CityTableProps> = ({
  cities,
  sortConfig,
  multiSortConfigs = [],
  onSort,
  loading = false,
}) => {
  const getSortIcon = (columnKey: keyof City) => {
    // Check if column is in multi-sort
    const multiSortConfig = multiSortConfigs.find(config => config.key === columnKey);

    if (multiSortConfig) {
      const priorityNumber = multiSortConfig.priority + 1; // Display as 1-based
      const arrow = multiSortConfig.direction === "asc" ? "↑" : "↓";
      return (
        <span className={styles.sortIcon}>
          {arrow}
          <span className={styles.sortPriority}>{priorityNumber}</span>
        </span>
      );
    }

    // Check single sort
    if (sortConfig.key === columnKey) {
      switch (sortConfig.direction) {
        case "asc":
          return <span className={styles.sortIcon}>↑</span>;
        case "desc":
          return <span className={styles.sortIcon}>↓</span>;
        default:
          return <span className={styles.sortIcon}>↕️</span>;
      }
    }

    // No sort applied
    return <span className={styles.sortIcon}>↕️</span>;
  };

  const getAriaSortForColumn = (columnKey: keyof City): "none" | "ascending" | "descending" => {
    // Check multi-sort first
    const multiSortConfig = multiSortConfigs.find(config => config.key === columnKey);
    if (multiSortConfig) {
      return getAriaSortValue(multiSortConfig.direction);
    }

    // Check single sort
    if (sortConfig.key === columnKey) {
      return getAriaSortValue(sortConfig.direction);
    }

    return "none";
  };

  const formatPopulation = (population: number): string => {
    return population.toLocaleString();
  };

  const formatCapitalStatus = (capital: string): string => {
    switch (capital) {
      case "primary":
        return "Primary Capital";
      case "admin":
        return "Administrative Capital";
      case "minor":
        return "Minor Capital";
      default:
        return capital || "Not a Capital";
    }
  };

  const renderMobileSortControls = () => (
    <div className={styles.sortControls}>
      <span style={{ fontSize: "12px", color: "#6b7280", marginRight: "8px" }}>
        Sort by:
      </span>
      <button
        className={`${styles.sortButton} ${sortConfig.key === "name" ? styles.active : ""}`}
        onClick={() => onSort("name")}
        aria-label="Sort by city name"
      >
        City Name
        {sortConfig.key === "name" && (
          <span className={styles.sortButtonIcon}>
            {sortConfig.direction === "asc"
              ? "↑"
              : sortConfig.direction === "desc"
                ? "↓"
                : "↕️"}
          </span>
        )}
      </button>
      <button
        className={`${styles.sortButton} ${sortConfig.key === "country" ? styles.active : ""}`}
        onClick={() => onSort("country")}
        aria-label="Sort by country"
      >
        Country
        {sortConfig.key === "country" && (
          <span className={styles.sortButtonIcon}>
            {sortConfig.direction === "asc"
              ? "↑"
              : sortConfig.direction === "desc"
                ? "↓"
                : "↕️"}
          </span>
        )}
      </button>
      <button
        className={`${styles.sortButton} ${sortConfig.key === "population" ? styles.active : ""}`}
        onClick={() => onSort("population")}
        aria-label="Sort by population"
      >
        Population
        {sortConfig.key === "population" && (
          <span className={styles.sortButtonIcon}>
            {sortConfig.direction === "asc"
              ? "↑"
              : sortConfig.direction === "desc"
                ? "↓"
                : "↕️"}
          </span>
        )}
      </button>
    </div>
  );

  const renderMobileCards = () => (
    <div className={styles.mobileCards}>
      {renderMobileSortControls()}
      {cities.map((city) => (
        <div
          key={city.id}
          className={styles.card}
          role="article"
          aria-label={`City: ${city.name}`}
        >
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>{city.name}</h3>
              <p className={styles.cardSubtitle}>{city.country}</p>
            </div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.cardField}>
              <span className={styles.cardFieldLabel}>Population</span>
              <span className={styles.cardFieldValue}>
                {formatPopulation(city.population)}
              </span>
            </div>
            <div className={styles.cardField}>
              <span className={styles.cardFieldLabel}>Capital Status</span>
              <span className={styles.cardFieldValue}>
                {formatCapitalStatus(city.capital)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer} role="status" aria-live="polite">
        <div className={styles.loading}>Loading cities...</div>
      </div>
    );
  }

  if (cities.length === 0) {
    return (
      <div className={styles.emptyState} role="status" aria-live="polite">
        <p>No cities found matching your search criteria.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table
        className={styles.table}
        role="table"
        aria-label="Cities data table"
      >
        <thead>
          <tr role="row">
            <th
              role="columnheader"
              aria-sort={getAriaSortForColumn("name")}
              className={styles.sortableHeader}
              onClick={(e) => onSort("name", e.ctrlKey || e.metaKey)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSort("name", e.ctrlKey || e.metaKey);
                }
              }}
              tabIndex={0}
            >
              <span>City Name</span>
              {getSortIcon("name")}
            </th>
            <th
              role="columnheader"
              aria-sort={getAriaSortForColumn("country")}
              className={styles.sortableHeader}
              onClick={(e) => onSort("country", e.ctrlKey || e.metaKey)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSort("country", e.ctrlKey || e.metaKey);
                }
              }}
              tabIndex={0}
            >
              <span>Country</span>
              {getSortIcon("country")}
            </th>
            <th
              role="columnheader"
              aria-sort={getAriaSortForColumn("population")}
              className={`${styles.sortableHeader} ${styles.numberHeader}`}
              onClick={(e) => onSort("population", e.ctrlKey || e.metaKey)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSort("population", e.ctrlKey || e.metaKey);
                }
              }}
              tabIndex={0}
            >
              <span>Population</span>
              {getSortIcon("population")}
            </th>
            <th role="columnheader" className={styles.capitalHeader}>Capital Status</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr key={city.id} role="row">
              <td role="gridcell">{city.name}</td>
              <td role="gridcell">{city.country}</td>
              <td role="gridcell" className={styles.numberCell}>
                {formatPopulation(city.population)}
              </td>
              <td role="gridcell" className={styles.capitalCell}>
                {formatCapitalStatus(city.capital)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card View */}
      {renderMobileCards()}
    </div>
  );
};

export default CityTable;
