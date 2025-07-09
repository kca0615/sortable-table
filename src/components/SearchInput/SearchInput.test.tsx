import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchInput from "./SearchInput";

describe("SearchInput", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default placeholder", () => {
    render(<SearchInput onSearch={mockOnSearch} />);
    
    expect(screen.getByPlaceholderText("Search cities by name or country...")).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    const customPlaceholder = "Custom search placeholder";
    render(<SearchInput onSearch={mockOnSearch} placeholder={customPlaceholder} />);
    
    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it("shows search icon when input is empty", () => {
    render(<SearchInput onSearch={mockOnSearch} />);

    const searchIconDiv = screen.getByTestId("search-icon");
    expect(searchIconDiv).toBeInTheDocument();

    const searchIcon = screen.getByAltText("");
    expect(searchIcon).toHaveAttribute("alt", "");
  });

  it("shows clear button when input has value", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "test");

    expect(screen.getByRole("button", { name: "Clear search" })).toBeInTheDocument();
    // Search icon should be hidden when there's text (it's conditionally rendered)
    const searchIconDiv = screen.queryByTestId("search-icon");
    expect(searchIconDiv).not.toBeInTheDocument();
  });

  it("calls onSearch with debounced value", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} debounceMs={100} />);

    const input = screen.getByRole("textbox");

    // Should call with empty string initially
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("");
    });

    mockOnSearch.mockClear();

    await user.type(input, "test");

    // Should call after debounce delay
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("test");
    }, { timeout: 200 });
  });

  it("clears input when clear button is clicked", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} />);
    
    const input = screen.getByRole("textbox");
    await user.type(input, "test");
    
    const clearButton = screen.getByRole("button", { name: "Clear search" });
    await user.click(clearButton);
    
    expect(input).toHaveValue("");
  });

  it("clears input when Escape key is pressed", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} />);
    
    const input = screen.getByRole("textbox");
    await user.type(input, "test");
    
    await user.keyboard("{Escape}");
    
    expect(input).toHaveValue("");
  });

  it("is disabled when disabled prop is true", () => {
    render(<SearchInput onSearch={mockOnSearch} disabled />);
    
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("calls onSearch with empty string when cleared", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} debounceMs={50} />);
    
    const input = screen.getByRole("textbox");
    await user.type(input, "test");
    
    // Wait for first search call
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("test");
    });
    
    mockOnSearch.mockClear();
    
    const clearButton = screen.getByRole("button", { name: "Clear search" });
    await user.click(clearButton);
    
    // Should call onSearch with empty string after debounce
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("");
    });
  });

  it("has proper accessibility attributes", () => {
    render(<SearchInput onSearch={mockOnSearch} />);
    
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "city-search");
    expect(input).toHaveAttribute("aria-describedby", "search-help");
    expect(input).toHaveAttribute("autoComplete", "off");
    
    expect(screen.getByText("Search by city name or country. Results update as you type.")).toBeInTheDocument();
  });
});
