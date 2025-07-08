import type { City } from '../api/getCities';

/**
 * Convert cities data to CSV format
 */
export const convertToCSV = (cities: City[]): string => {
  if (cities.length === 0) {
    return '';
  }

  // Define headers
  const headers = [
    'City Name',
    'Country', 
    'Population',
    'Capital Status'
  ];

  // Convert capital status to readable format
  const formatCapitalStatus = (capital: string): string => {
    switch (capital) {
      case 'primary':
        return 'Primary Capital';
      case 'admin':
        return 'Administrative Capital';
      case 'minor':
        return 'Minor Capital';
      default:
        return capital || 'Not a Capital';
    }
  };

  // Create CSV rows
  const csvRows = [
    headers.join(','), // Header row
    ...cities.map(city => [
      `"${city.name}"`,
      `"${city.country}"`,
      city.population.toString(),
      `"${formatCapitalStatus(city.capital)}"`
    ].join(','))
  ];

  return csvRows.join('\n');
};

/**
 * Download CSV file
 */
export const downloadCSV = (csvContent: string, filename: string = 'cities-export.csv'): void => {
  // Create blob with CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
};

/**
 * Export cities to CSV file
 */
export const exportCitiesToCSV = (cities: City[], filename?: string): void => {
  const csvContent = convertToCSV(cities);
  
  if (csvContent) {
    const defaultFilename = `cities-export-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename || defaultFilename);
  }
};
