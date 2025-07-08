import { convertToCSV } from './export';
import type { City } from '../api/getCities';

describe('convertToCSV', () => {
  const mockCities: City[] = [
    {
      id: 1,
      name: 'New York',
      nameAscii: 'New York',
      country: 'United States',
      countryIso3: 'USA',
      capital: 'admin',
      population: 8175133
    },
    {
      id: 2,
      name: 'London',
      nameAscii: 'London',
      country: 'United Kingdom',
      countryIso3: 'GBR',
      capital: 'primary',
      population: 8982000
    },
    {
      id: 3,
      name: 'Tokyo',
      nameAscii: 'Tokyo',
      country: 'Japan',
      countryIso3: 'JPN',
      capital: 'primary',
      population: 13929286
    }
  ];

  it('should convert cities to CSV format with headers', () => {
    const result = convertToCSV(mockCities);
    const lines = result.split('\n');
    
    expect(lines[0]).toBe('City Name,Country,Population,Capital Status');
    expect(lines.length).toBe(4); // 1 header + 3 data rows
  });

  it('should properly format city data in CSV rows', () => {
    const result = convertToCSV(mockCities);
    const lines = result.split('\n');
    
    expect(lines[1]).toBe('"New York","United States",8175133,"Administrative Capital"');
    expect(lines[2]).toBe('"London","United Kingdom",8982000,"Primary Capital"');
    expect(lines[3]).toBe('"Tokyo","Japan",13929286,"Primary Capital"');
  });

  it('should handle empty cities array', () => {
    const result = convertToCSV([]);
    expect(result).toBe('');
  });

  it('should format capital status correctly', () => {
    const cityWithNoCapital: City = {
      id: 4,
      name: 'Seattle',
      nameAscii: 'Seattle',
      country: 'United States',
      countryIso3: 'USA',
      capital: '',
      population: 753675
    };

    const result = convertToCSV([cityWithNoCapital]);
    const lines = result.split('\n');
    
    expect(lines[1]).toBe('"Seattle","United States",753675,"Not a Capital"');
  });

  it('should handle special characters in city names', () => {
    const cityWithSpecialChars: City = {
      id: 5,
      name: 'São Paulo',
      nameAscii: 'Sao Paulo',
      country: 'Brazil',
      countryIso3: 'BRA',
      capital: '',
      population: 12325232
    };

    const result = convertToCSV([cityWithSpecialChars]);
    const lines = result.split('\n');
    
    expect(lines[1]).toBe('"São Paulo","Brazil",12325232,"Not a Capital"');
  });
});
