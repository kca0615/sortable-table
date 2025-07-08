export type SortDirection = "asc" | "desc" | "none";

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
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
 * Gets the ARIA sort value for accessibility
 * @param direction Current sort direction
 * @returns ARIA sort value
 */
export function getAriaSortValue(direction: SortDirection): string {
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
