export type SortDirection = "asc" | "desc" | "none";

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

export interface MultiSortConfig<T> {
  key: keyof T;
  direction: SortDirection;
  priority: number; // 0 = highest priority
}

/**
 * Sorts an array of objects by a specified key and direction
 * @param data Array of objects to sort
 * @param config Sort configuration with key and direction
 * @returns Sorted array (does not mutate original)
 */
export function sortData<T>(data: T[], config: SortConfig<T>): T[] {
  if (config.direction === "none") {
    return [...data];
  }

  return [...data].sort((a, b) => {
    const aValue = a[config.key];
    const bValue = b[config.key];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return config.direction === "asc" ? -1 : 1;
    if (bValue == null) return config.direction === "asc" ? 1 : -1;

    // Handle string comparison (case-insensitive)
    if (typeof aValue === "string" && typeof bValue === "string") {
      const comparison = aValue
        .toLowerCase()
        .localeCompare(bValue.toLowerCase());
      return config.direction === "asc" ? comparison : -comparison;
    }

    // Handle number comparison
    if (typeof aValue === "number" && typeof bValue === "number") {
      return config.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    // Fallback to string comparison
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    const comparison = aStr.localeCompare(bStr);
    return config.direction === "asc" ? comparison : -comparison;
  });
}

/**
 * Toggles sort direction: none -> asc -> desc -> none
 * @param currentDirection Current sort direction
 * @returns Next sort direction
 */
export function toggleSortDirection(
  currentDirection: SortDirection,
): SortDirection {
  switch (currentDirection) {
    case "none":
      return "asc";
    case "asc":
      return "desc";
    case "desc":
      return "none";
    default:
      return "asc";
  }
}

/**
 * Sorts an array of objects by multiple criteria
 * @param data Array of objects to sort
 * @param configs Array of sort configurations ordered by priority
 * @returns Sorted array (does not mutate original)
 */
export function sortDataMulti<T>(data: T[], configs: MultiSortConfig<T>[]): T[] {
  if (configs.length === 0) {
    return [...data];
  }

  // Filter out "none" directions and sort by priority
  const activeSorts = configs
    .filter(config => config.direction !== "none")
    .sort((a, b) => a.priority - b.priority);

  if (activeSorts.length === 0) {
    return [...data];
  }

  return [...data].sort((a, b) => {
    // Compare by each sort criteria in priority order
    for (const config of activeSorts) {
      const aValue = a[config.key];
      const bValue = b[config.key];

      // Handle null/undefined values
      if (aValue == null && bValue == null) continue;
      if (aValue == null) return config.direction === "asc" ? -1 : 1;
      if (bValue == null) return config.direction === "asc" ? 1 : -1;

      let comparison = 0;

      // Handle string comparison (case-insensitive)
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
      }
      // Handle number comparison
      else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      }
      // Fallback to string comparison
      else {
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        comparison = aStr.localeCompare(bStr);
      }

      // If values are different, return the comparison result
      if (comparison !== 0) {
        return config.direction === "asc" ? comparison : -comparison;
      }

      // If values are equal, continue to next sort criteria
    }

    // All sort criteria resulted in equality
    return 0;
  });
}

/**
 * Gets the ARIA sort value for accessibility
 * @param direction Current sort direction
 * @returns ARIA sort value
 */
export function getAriaSortValue(direction: SortDirection): "none" | "ascending" | "descending" {
  switch (direction) {
    case "asc":
      return "ascending";
    case "desc":
      return "descending";
    case "none":
    default:
      return "none";
  }
}
