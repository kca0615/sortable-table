import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CityTable from "./CityTable";
import type { City } from "../../api/getCities";

const mockCities: City[] = [
  {
    id: 1,
    name: "Tokyo",
    nameAscii: "Tokyo",
    country: "Japan",
    countryIso3: "JPN",
    population: 13929286,
    capital: "primary",
  },
  {
    id: 2,
    name: "New York",
    nameAscii: "New York",
    country: "United States",
    countryIso3: "USA",
    population: 8336817,
    capital: "admin",
  },
  {
    id: 3,
    name: "London",
    nameAscii: "London",
    country: "United Kingdom",
    countryIso3: "GBR",
    population: 8982000,
    capital: "primary",
  },
];

describe("CityTable", () => {
  const mockOnSort = jest.fn();
  const defaultProps = {
    cities: mockCities,
    sortConfig: { key: null as keyof City | null, direction: "none" as const },
    onSort: mockOnSort,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders table with city data", () => {
    render(<CityTable {...defaultProps} />);

    expect(screen.getByRole("table", { name: "Cities data table" })).toBeInTheDocument();
    expect(screen.getAllByText("Tokyo")).toHaveLength(2); // Table and mobile card
    expect(screen.getAllByText("Japan")).toHaveLength(2); // Table and mobile card
    expect(screen.getAllByText("13,929,286")).toHaveLength(2); // Table and mobile card
  });

  it("renders column headers", () => {
    render(<CityTable {...defaultProps} />);
    
    expect(screen.getByRole("columnheader", { name: /city name/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /country/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /population/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /capital status/i })).toBeInTheDocument();
  });

  it("calls onSort when column header is clicked", async () => {
    const user = userEvent.setup();
    render(<CityTable {...defaultProps} />);
    
    const nameHeader = screen.getByRole("columnheader", { name: /city name/i });
    await user.click(nameHeader);
    
    expect(mockOnSort).toHaveBeenCalledWith("name");
  });

  it("calls onSort when Enter key is pressed on column header", () => {
    render(<CityTable {...defaultProps} />);
    
    const nameHeader = screen.getByRole("columnheader", { name: /city name/i });
    fireEvent.keyDown(nameHeader, { key: "Enter" });
    
    expect(mockOnSort).toHaveBeenCalledWith("name");
  });

  it("calls onSort when Space key is pressed on column header", () => {
    render(<CityTable {...defaultProps} />);
    
    const nameHeader = screen.getByRole("columnheader", { name: /city name/i });
    fireEvent.keyDown(nameHeader, { key: " " });
    
    expect(mockOnSort).toHaveBeenCalledWith("name");
  });

  it("displays sort icons for sorted columns", () => {
    const sortedProps = {
      ...defaultProps,
      sortConfig: { key: "name" as keyof City, direction: "asc" as const },
    };
    
    render(<CityTable {...sortedProps} />);
    
    const nameHeader = screen.getByRole("columnheader", { name: /city name/i });
    expect(nameHeader).toHaveTextContent("↑");
  });

  it("displays multi-sort indicators", () => {
    const multiSortProps = {
      ...defaultProps,
      multiSortConfigs: [
        { key: "name" as keyof City, direction: "asc" as const, priority: 0 },
        { key: "population" as keyof City, direction: "desc" as const, priority: 1 },
      ],
    };
    
    render(<CityTable {...multiSortProps} />);
    
    const nameHeader = screen.getByRole("columnheader", { name: /city name/i });
    const populationHeader = screen.getByRole("columnheader", { name: /population/i });
    
    expect(nameHeader).toHaveTextContent("↑1");
    expect(populationHeader).toHaveTextContent("↓2");
  });

  it("formats population numbers correctly", () => {
    render(<CityTable {...defaultProps} />);

    expect(screen.getAllByText("13,929,286")).toHaveLength(2); // Table and mobile card
    expect(screen.getAllByText("8,336,817")).toHaveLength(2); // Table and mobile card
    expect(screen.getAllByText("8,982,000")).toHaveLength(2); // Table and mobile card
  });

  it("formats capital status correctly", () => {
    render(<CityTable {...defaultProps} />);

    expect(screen.getAllByText("Primary Capital")).toHaveLength(4); // 2 cities × 2 views (table + mobile)
    expect(screen.getAllByText("Administrative Capital")).toHaveLength(2); // 1 city × 2 views
  });

  it("shows loading state", () => {
    render(<CityTable {...defaultProps} loading />);
    
    expect(screen.getByText("Loading cities...")).toBeInTheDocument();
  });

  it("shows empty state when no cities", () => {
    render(<CityTable {...defaultProps} cities={[]} />);

    expect(screen.getByText("No cities found matching your search criteria.")).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<CityTable {...defaultProps} />);
    
    const table = screen.getByRole("table");
    expect(table).toHaveAttribute("aria-label", "Cities data table");
    
    const headers = screen.getAllByRole("columnheader");
    headers.slice(0, 3).forEach(header => {
      expect(header).toHaveAttribute("tabIndex", "0");
    });
  });
});
