import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExportButton from "./ExportButton";
import type { City } from "../../api/getCities";
import * as exportUtils from "../../utils/export";

// Mock the export utility
jest.mock("../../utils/export", () => ({
  exportCitiesToCSV: jest.fn(),
}));

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
];

describe("ExportButton", () => {
  const mockExportCitiesToCSV = exportUtils.exportCitiesToCSV as jest.MockedFunction<typeof exportUtils.exportCitiesToCSV>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default text", () => {
    render(<ExportButton cities={mockCities} />);
    
    expect(screen.getByRole("button", { name: /export 2 cities to csv file/i })).toBeInTheDocument();
    expect(screen.getByText("Export CSV")).toBeInTheDocument();
  });

  it("shows export icon", () => {
    render(<ExportButton cities={mockCities} />);
    
    expect(screen.getByText("📊")).toBeInTheDocument();
  });

  it("calls export function when clicked", async () => {
    const user = userEvent.setup();
    render(<ExportButton cities={mockCities} />);
    
    const button = screen.getByRole("button");
    await user.click(button);
    
    await waitFor(() => {
      expect(mockExportCitiesToCSV).toHaveBeenCalledWith(mockCities);
    });
  });

  it("shows loading state during export", async () => {
    const user = userEvent.setup();
    render(<ExportButton cities={mockCities} />);
    
    const button = screen.getByRole("button");
    await user.click(button);
    
    expect(screen.getByText("Exporting...")).toBeInTheDocument();
    expect(button).toBeDisabled();
    
    await waitFor(() => {
      expect(screen.getByText("Export CSV")).toBeInTheDocument();
    });
  });

  it("is disabled when no cities", () => {
    render(<ExportButton cities={[]} />);
    
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("title", "No data to export");
  });

  it("is disabled when disabled prop is true", () => {
    render(<ExportButton cities={mockCities} disabled />);
    
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("does not export when disabled", async () => {
    const user = userEvent.setup();
    render(<ExportButton cities={mockCities} disabled />);
    
    const button = screen.getByRole("button");
    await user.click(button);
    
    expect(mockExportCitiesToCSV).not.toHaveBeenCalled();
  });

  it("does not export when no cities", async () => {
    const user = userEvent.setup();
    render(<ExportButton cities={[]} />);
    
    const button = screen.getByRole("button");
    await user.click(button);
    
    expect(mockExportCitiesToCSV).not.toHaveBeenCalled();
  });

  it("applies custom className", () => {
    render(<ExportButton cities={mockCities} className="custom-class" />);
    
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("has proper accessibility attributes", () => {
    render(<ExportButton cities={mockCities} />);
    
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Export 2 cities to CSV file");
    expect(button).toHaveAttribute("title", "Export 2 cities to CSV");
    expect(button).toHaveAttribute("type", "button");
  });

  it("updates aria-label based on city count", () => {
    const singleCity = [mockCities[0]];
    render(<ExportButton cities={singleCity} />);
    
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Export 1 cities to CSV file");
  });

  it("handles export errors gracefully", async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockExportCitiesToCSV.mockImplementation(() => {
      throw new Error("Export failed");
    });
    
    render(<ExportButton cities={mockCities} />);
    
    const button = screen.getByRole("button");
    await user.click(button);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Export failed:", expect.any(Error));
    });
    
    // Should return to normal state after error
    expect(screen.getByText("Export CSV")).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    
    consoleErrorSpy.mockRestore();
  });
});
