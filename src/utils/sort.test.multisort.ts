import { sortDataMulti, MultiSortConfig } from './sort';

describe('sortDataMulti', () => {
  const testData = [
    { id: 1, name: 'Tokyo', country: 'Japan', population: 39105000 },
    { id: 2, name: 'Delhi', country: 'India', population: 31870000 },
    { id: 3, name: 'Shanghai', country: 'China', population: 22118000 },
    { id: 4, name: 'São Paulo', country: 'Brazil', population: 22495000 },
    { id: 5, name: 'Mumbai', country: 'India', population: 20411000 },
    { id: 6, name: 'Beijing', country: 'China', population: 21707000 },
  ];

  it('should return original array when no sort configs provided', () => {
    const result = sortDataMulti(testData, []);
    expect(result).toEqual(testData);
    expect(result).not.toBe(testData); // Should be a new array
  });

  it('should sort by single column when one config provided', () => {
    const configs: MultiSortConfig<typeof testData[0]>[] = [
      { key: 'name', direction: 'asc', priority: 0 }
    ];
    
    const result = sortDataMulti(testData, configs);
    expect(result.map(item => item.name)).toEqual([
      'Beijing', 'Delhi', 'Mumbai', 'São Paulo', 'Shanghai', 'Tokyo'
    ]);
  });

  it('should sort by multiple columns with priority', () => {
    const configs: MultiSortConfig<typeof testData[0]>[] = [
      { key: 'country', direction: 'asc', priority: 0 }, // Primary sort
      { key: 'population', direction: 'desc', priority: 1 } // Secondary sort
    ];
    
    const result = sortDataMulti(testData, configs);
    
    // Should be sorted by country first, then by population (desc) within same country
    expect(result.map(item => ({ country: item.country, name: item.name }))).toEqual([
      { country: 'Brazil', name: 'São Paulo' },
      { country: 'China', name: 'Shanghai' }, // Higher population than Beijing
      { country: 'China', name: 'Beijing' },
      { country: 'India', name: 'Delhi' }, // Higher population than Mumbai
      { country: 'India', name: 'Mumbai' },
      { country: 'Japan', name: 'Tokyo' }
    ]);
  });

  it('should respect priority order regardless of config array order', () => {
    const configs: MultiSortConfig<typeof testData[0]>[] = [
      { key: 'population', direction: 'desc', priority: 1 }, // Secondary sort (added first)
      { key: 'country', direction: 'asc', priority: 0 } // Primary sort (added second)
    ];
    
    const result = sortDataMulti(testData, configs);
    
    // Should still sort by country first (priority 0), then population (priority 1)
    expect(result.map(item => ({ country: item.country, name: item.name }))).toEqual([
      { country: 'Brazil', name: 'São Paulo' },
      { country: 'China', name: 'Shanghai' },
      { country: 'China', name: 'Beijing' },
      { country: 'India', name: 'Delhi' },
      { country: 'India', name: 'Mumbai' },
      { country: 'Japan', name: 'Tokyo' }
    ]);
  });

  it('should filter out "none" directions', () => {
    const configs: MultiSortConfig<typeof testData[0]>[] = [
      { key: 'country', direction: 'none', priority: 0 },
      { key: 'name', direction: 'asc', priority: 1 }
    ];
    
    const result = sortDataMulti(testData, configs);
    
    // Should only sort by name since country direction is "none"
    expect(result.map(item => item.name)).toEqual([
      'Beijing', 'Delhi', 'Mumbai', 'São Paulo', 'Shanghai', 'Tokyo'
    ]);
  });

  it('should handle three-level sorting', () => {
    const extendedData = [
      ...testData,
      { id: 7, name: 'Bangalore', country: 'India', population: 12442000 },
      { id: 8, name: 'Shenzhen', country: 'China', population: 12357000 }
    ];

    const configs: MultiSortConfig<typeof extendedData[0]>[] = [
      { key: 'country', direction: 'asc', priority: 0 },
      { key: 'population', direction: 'desc', priority: 1 },
      { key: 'name', direction: 'asc', priority: 2 }
    ];
    
    const result = sortDataMulti(extendedData, configs);
    
    // Verify the India cities are sorted correctly (by population desc, then name asc)
    const indiaCities = result.filter(city => city.country === 'India');
    expect(indiaCities.map(city => city.name)).toEqual([
      'Delhi', 'Mumbai', 'Bangalore' // Population: 31870000, 20411000, 12442000
    ]);
  });

  it('should not mutate the original array', () => {
    const original = [...testData];
    const configs: MultiSortConfig<typeof testData[0]>[] = [
      { key: 'name', direction: 'asc', priority: 0 }
    ];
    
    sortDataMulti(testData, configs);
    expect(testData).toEqual(original);
  });
});
