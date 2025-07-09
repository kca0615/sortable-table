import React, { useState, useEffect } from "react";
import { useDebounce } from "../../utils/debounce";
import styles from "./SearchInput.module.css";
import SearchIconUrl from "../../assets/Search.svg";
import CloseIconUrl from "../../assets/Close.svg";

export interface SearchInputProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  debounceMs?: number;
  disabled?: boolean;
}

function SearchInput({
  onSearch,
  placeholder = "Search cities by name or country...",
  debounceMs = 150,
  disabled = false,
}: SearchInputProps) {
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
      <div className={styles.inputContainer}>
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
        {!inputValue && (
          <div className={styles.searchIcon} aria-hidden="true" data-testid="search-icon">
            <img src={SearchIconUrl} alt="" width="16" height="16" />
          </div>
        )}
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            aria-label="Clear search"
            title="Clear search"
          >
            <img src={CloseIconUrl} alt="" width="16" height="16" />
          </button>
        )}
      </div>
      <div id="search-help" className={styles.helpText}>
        Search by city name or country. Results update as you type.
      </div>
    </div>
  );
}

export default SearchInput;
