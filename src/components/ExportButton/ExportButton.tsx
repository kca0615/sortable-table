import React, { useState } from 'react';
import type { City } from '../../api/getCities';
import { exportCitiesToCSV } from '../../utils/export';
import styles from './ExportButton.module.css';

export interface ExportButtonProps {
  cities: City[];
  disabled?: boolean;
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  cities, 
  disabled = false,
  className = ''
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (disabled || cities.length === 0) {
      return;
    }

    setIsExporting(true);
    
    try {
      // Add small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      exportCitiesToCSV(cities);
    } catch (error) {
      console.error('Export failed:', error);
      // In a real app, you might want to show a toast notification here
    } finally {
      setIsExporting(false);
    }
  };

  const buttonText = isExporting ? 'Exporting...' : 'Export CSV';
  const isDisabled = disabled || cities.length === 0 || isExporting;

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isDisabled}
      className={`${styles.exportButton} ${className}`}
      aria-label={`Export ${cities.length} cities to CSV file`}
      title={cities.length === 0 ? 'No data to export' : `Export ${cities.length} cities to CSV`}
    >
      <span className={styles.icon} aria-hidden="true">
        📊
      </span>
      {buttonText}
    </button>
  );
};

export default ExportButton;
