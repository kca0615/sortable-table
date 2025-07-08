import { paginateData, getPageNumbers, paginationHelpers } from "./paginate";

describe("paginateData", () => {
  const testData = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
  }));

  it("should paginate data correctly for first page", () => {
    const result = paginateData(testData, {
      currentPage: 1,
      pageSize: 10,
      totalItems: testData.length,
    });

    expect(result.data).toHaveLength(10);
    expect(result.data[0].id).toBe(1);
    expect(result.data[9].id).toBe(10);
    expect(result.pagination.currentPage).toBe(1);
    expect(result.pagination.totalPages).toBe(3);
    expect(result.pagination.hasNextPage).toBe(true);
    expect(result.pagination.hasPreviousPage).toBe(false);
    expect(result.pagination.startIndex).toBe(1);
    expect(result.pagination.endIndex).toBe(10);
  });

  it("should paginate data correctly for middle page", () => {
    const result = paginateData(testData, {
      currentPage: 2,
      pageSize: 10,
      totalItems: testData.length,
    });

    expect(result.data).toHaveLength(10);
    expect(result.data[0].id).toBe(11);
    expect(result.data[9].id).toBe(20);
    expect(result.pagination.currentPage).toBe(2);
    expect(result.pagination.hasNextPage).toBe(true);
    expect(result.pagination.hasPreviousPage).toBe(true);
    expect(result.pagination.startIndex).toBe(11);
    expect(result.pagination.endIndex).toBe(20);
  });

  it("should paginate data correctly for last page", () => {
    const result = paginateData(testData, {
      currentPage: 3,
      pageSize: 10,
      totalItems: testData.length,
    });

    expect(result.data).toHaveLength(5);
    expect(result.data[0].id).toBe(21);
    expect(result.data[4].id).toBe(25);
    expect(result.pagination.currentPage).toBe(3);
    expect(result.pagination.hasNextPage).toBe(false);
    expect(result.pagination.hasPreviousPage).toBe(true);
    expect(result.pagination.startIndex).toBe(21);
    expect(result.pagination.endIndex).toBe(25);
  });

  it("should handle page number out of bounds", () => {
    const result = paginateData(testData, {
      currentPage: 10,
      pageSize: 10,
      totalItems: testData.length,
    });

    expect(result.pagination.currentPage).toBe(3); // Should clamp to last page
  });

  it("should handle page number less than 1", () => {
    const result = paginateData(testData, {
      currentPage: 0,
      pageSize: 10,
      totalItems: testData.length,
    });

    expect(result.pagination.currentPage).toBe(1); // Should clamp to first page
  });

  it("should handle empty data", () => {
    const result = paginateData([], {
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
    });

    expect(result.data).toHaveLength(0);
    expect(result.pagination.totalPages).toBe(0);
    expect(result.pagination.hasNextPage).toBe(false);
    expect(result.pagination.hasPreviousPage).toBe(false);
  });

  it("should calculate total pages correctly", () => {
    const result1 = paginateData(testData, {
      currentPage: 1,
      pageSize: 10,
      totalItems: 25,
    });
    expect(result1.pagination.totalPages).toBe(3);

    const result2 = paginateData(testData, {
      currentPage: 1,
      pageSize: 10,
      totalItems: 30,
    });
    expect(result2.pagination.totalPages).toBe(3);

    const result3 = paginateData(testData, {
      currentPage: 1,
      pageSize: 10,
      totalItems: 31,
    });
    expect(result3.pagination.totalPages).toBe(4);
  });
});

describe("getPageNumbers", () => {
  it("should return all pages when total pages <= maxVisible", () => {
    expect(getPageNumbers(1, 3, 5)).toEqual([1, 2, 3]);
    expect(getPageNumbers(2, 5, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("should return correct range when current page is near start", () => {
    expect(getPageNumbers(1, 10, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageNumbers(2, 10, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("should return correct range when current page is in middle", () => {
    expect(getPageNumbers(5, 10, 5)).toEqual([3, 4, 5, 6, 7]);
    expect(getPageNumbers(6, 10, 5)).toEqual([4, 5, 6, 7, 8]);
  });

  it("should return correct range when current page is near end", () => {
    expect(getPageNumbers(9, 10, 5)).toEqual([6, 7, 8, 9, 10]);
    expect(getPageNumbers(10, 10, 5)).toEqual([6, 7, 8, 9, 10]);
  });

  it("should handle edge cases", () => {
    expect(getPageNumbers(1, 1, 5)).toEqual([1]);
    expect(getPageNumbers(1, 0, 5)).toEqual([]);
  });
});

describe("paginationHelpers", () => {
  it("should go to first page", () => {
    expect(paginationHelpers.goToFirstPage()).toBe(1);
  });

  it("should go to previous page", () => {
    expect(paginationHelpers.goToPreviousPage(5)).toBe(4);
    expect(paginationHelpers.goToPreviousPage(1)).toBe(1); // Should not go below 1
  });

  it("should go to next page", () => {
    expect(paginationHelpers.goToNextPage(5, 10)).toBe(6);
    expect(paginationHelpers.goToNextPage(10, 10)).toBe(10); // Should not exceed total
  });

  it("should go to last page", () => {
    expect(paginationHelpers.goToLastPage(10)).toBe(10);
  });

  it("should go to specific page within bounds", () => {
    expect(paginationHelpers.goToPage(5, 10)).toBe(5);
    expect(paginationHelpers.goToPage(0, 10)).toBe(1); // Should clamp to 1
    expect(paginationHelpers.goToPage(15, 10)).toBe(10); // Should clamp to max
  });
});
