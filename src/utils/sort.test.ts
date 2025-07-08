import {
  sortData,
  toggleSortDirection,
  getAriaSortValue,
  SortDirection,
} from "./sort";

describe("sortData", () => {
  const testData = [
    { id: 1, name: "Tokyo", country: "Japan", population: 39105000 },
    { id: 2, name: "Delhi", country: "India", population: 31870000 },
    { id: 3, name: "Shanghai", country: "China", population: 22118000 },
    { id: 4, name: "São Paulo", country: "Brazil", population: 22495000 },
  ];

  it("should return original array when direction is none", () => {
    const result = sortData(testData, { key: "name", direction: "none" });
    expect(result).toEqual(testData);
    expect(result).not.toBe(testData); // Should be a new array
  });

  it("should sort strings in ascending order", () => {
    const result = sortData(testData, { key: "name", direction: "asc" });
    expect(result.map((item) => item.name)).toEqual([
      "Delhi",
      "São Paulo",
      "Shanghai",
      "Tokyo",
    ]);
  });

  it("should sort strings in descending order", () => {
    const result = sortData(testData, { key: "name", direction: "desc" });
    expect(result.map((item) => item.name)).toEqual([
      "Tokyo",
      "Shanghai",
      "São Paulo",
      "Delhi",
    ]);
  });

  it("should sort numbers in ascending order", () => {
    const result = sortData(testData, { key: "population", direction: "asc" });
    expect(result.map((item) => item.population)).toEqual([
      22118000, 22495000, 31870000, 39105000,
    ]);
  });

  it("should sort numbers in descending order", () => {
    const result = sortData(testData, { key: "population", direction: "desc" });
    expect(result.map((item) => item.population)).toEqual([
      39105000, 31870000, 22495000, 22118000,
    ]);
  });

  it("should handle case-insensitive string sorting", () => {
    const caseTestData = [
      { name: "apple" },
      { name: "Banana" },
      { name: "cherry" },
      { name: "Apple" },
    ];
    const result = sortData(caseTestData, { key: "name", direction: "asc" });
    expect(result.map((item) => item.name)).toEqual([
      "apple",
      "Apple",
      "Banana",
      "cherry",
    ]);
  });

  it("should handle null and undefined values", () => {
    const nullTestData = [
      { name: "Valid", value: 10 },
      { name: null, value: 20 },
      { name: "Another", value: null },
      { name: undefined, value: 30 },
    ];

    const resultAsc = sortData(nullTestData, { key: "name", direction: "asc" });
    // Null and undefined should be at the beginning for ascending
    expect(resultAsc[0].name == null).toBe(true);
    expect(resultAsc[1].name == null).toBe(true);

    const resultDesc = sortData(nullTestData, {
      key: "name",
      direction: "desc",
    });
    // Null and undefined should be at the end for descending
    expect(resultDesc[resultDesc.length - 2].name == null).toBe(true);
    expect(resultDesc[resultDesc.length - 1].name == null).toBe(true);
  });

  it("should not mutate the original array", () => {
    const original = [...testData];
    sortData(testData, { key: "name", direction: "asc" });
    expect(testData).toEqual(original);
  });
});

describe("toggleSortDirection", () => {
  it("should toggle from none to asc", () => {
    expect(toggleSortDirection("none")).toBe("asc");
  });

  it("should toggle from asc to desc", () => {
    expect(toggleSortDirection("asc")).toBe("desc");
  });

  it("should toggle from desc to none", () => {
    expect(toggleSortDirection("desc")).toBe("none");
  });

  it("should default to asc for invalid direction", () => {
    expect(toggleSortDirection("invalid" as SortDirection)).toBe("asc");
  });
});

describe("getAriaSortValue", () => {
  it("should return correct ARIA values", () => {
    expect(getAriaSortValue("asc")).toBe("ascending");
    expect(getAriaSortValue("desc")).toBe("descending");
    expect(getAriaSortValue("none")).toBe("none");
  });

  it("should default to none for invalid direction", () => {
    expect(getAriaSortValue("invalid" as SortDirection)).toBe("none");
  });
});
