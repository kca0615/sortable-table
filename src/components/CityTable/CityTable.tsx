import React from "react";
import type { City } from "../../api/getCities";
import { SortDirection, getAriaSortValue } from "../../utils/sort";
import styles from "./CityTable.module.css";

export interface CityTableProps {
  cities: City[];
  sortConfig: {
    key: keyof City | null;
    direction: SortDirection;
  };
  onSort: (key: keyof City) => void;
  loading?: boolean;
}

const CityTable: React.FC<CityTableProps> = ({
  cities,
  sortConfig,
  onSort,
  loading = false,
}) => {
  const getSortIcon = (columnKey: keyof City) => {
    if (sortConfig.key !== columnKey) {
      return <span className={styles.sortIcon}>↕️</span>;
    }

    switch (sortConfig.direction) {
      case "asc":
        return <span className={styles.sortIcon}>↑</span>;
      case "desc":
        return <span className={styles.sortIcon}>↓</span>;
      default:
        return <span className={styles.sortIcon}>↕️</span>;
    }
  };

  const getAriaSortForColumn = (columnKey: keyof City): string => {
    if (sortConfig.key !== columnKey) {
      return "none";
    }
    return getAriaSortValue(sortConfig.direction);
  };

  const formatPopulation = (population: number): string => {
    return population.toLocaleString();
  };

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
              onClick={() => onSort("name")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSort("name");
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
              onClick={() => onSort("country")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSort("country");
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
              className={styles.sortableHeader}
              onClick={() => onSort("population")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSort("population");
                }
              }}
              tabIndex={0}
            >
              <span>Population</span>
              {getSortIcon("population")}
            </th>
            <th role="columnheader">Capital Status</th>
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
                {city.capital === "primary"
                  ? "Primary Capital"
                  : city.capital === "admin"
                    ? "Administrative Capital"
                    : city.capital === "minor"
                      ? "Minor Capital"
                      : city.capital || "Not a Capital"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CityTable;
