import React, { useState, useEffect } from "react";
import { useDebounce } from "../../utils/debounce";
import styles from "./SearchInput.module.css";

export interface SearchInputProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  debounceMs?: number;
  disabled?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = "Search cities by name or country...",
  debounceMs = 150,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const debouncedSearchTerm = useDebounce(inputValue, debounceMs);

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className={styles.searchContainer}>
      <label htmlFor="city-search" className={styles.label}>
        Search Cities
      </label>
      <div className={styles.inputContainer}>
        <div className={styles.searchIcon} aria-hidden="true">
          🔍
        </div>
        <input
          id="city-search"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.input}
          aria-describedby="search-help"
          autoComplete="off"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            aria-label="Clear search"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      <div id="search-help" className={styles.helpText}>
        Search by city name or country. Results update as you type.
      </div>
    </div>
  );
};

export default SearchInput;
