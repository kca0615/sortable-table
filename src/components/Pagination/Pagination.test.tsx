import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "./Pagination";

describe("Pagination", () => {
  const mockOnPageChange = jest.fn();
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    totalItems: 50,
    pageSize: 10,
    onPageChange: mockOnPageChange,
    startIndex: 1,
    endIndex: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders pagination info", () => {
    render(<Pagination {...defaultProps} />);
    
    expect(screen.getByText("Showing 1 to 10 of 50 results")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 5")).toBeInTheDocument();
  });

  it("renders all navigation buttons", () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    expect(screen.getByRole("button", { name: "Go to first page" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to previous page" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to next page" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to last page" })).toBeInTheDocument();
  });

  it("disables first and previous buttons on first page", () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    
    expect(screen.getByRole("button", { name: "Go to first page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Go to previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Go to next page" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Go to last page" })).not.toBeDisabled();
  });

  it("disables next and last buttons on last page", () => {
    render(<Pagination {...defaultProps} currentPage={5} totalPages={5} />);
    
    expect(screen.getByRole("button", { name: "Go to first page" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Go to previous page" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Go to next page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Go to last page" })).toBeDisabled();
  });

  it("calls onPageChange with correct page when first button is clicked", async () => {
    const user = userEvent.setup();
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    const firstButton = screen.getByRole("button", { name: "Go to first page" });
    await user.click(firstButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange with correct page when previous button is clicked", async () => {
    const user = userEvent.setup();
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    const previousButton = screen.getByRole("button", { name: "Go to previous page" });
    await user.click(previousButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with correct page when next button is clicked", async () => {
    const user = userEvent.setup();
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    const nextButton = screen.getByRole("button", { name: "Go to next page" });
    await user.click(nextButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it("calls onPageChange with correct page when last button is clicked", async () => {
    const user = userEvent.setup();
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    const lastButton = screen.getByRole("button", { name: "Go to last page" });
    await user.click(lastButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(5);
  });

  it("handles keyboard navigation with Enter key", () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    const nextButton = screen.getByRole("button", { name: "Go to next page" });
    fireEvent.keyDown(nextButton, { key: "Enter" });
    
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it("handles keyboard navigation with Space key", () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    const nextButton = screen.getByRole("button", { name: "Go to next page" });
    fireEvent.keyDown(nextButton, { key: " " });
    
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it("does not render when totalItems is 0", () => {
    render(<Pagination {...defaultProps} totalItems={0} />);
    
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("displays correct button text and icons", () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    expect(screen.getByText("⏮")).toBeInTheDocument(); // First
    expect(screen.getByText("◀")).toBeInTheDocument(); // Previous
    expect(screen.getByText("▶")).toBeInTheDocument(); // Next
    expect(screen.getByText("⏭")).toBeInTheDocument(); // Last
    
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.getByText("Last")).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<Pagination {...defaultProps} />);
    
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Pagination navigation");
    
    const buttons = screen.getAllByRole("button");
    buttons.forEach(button => {
      expect(button).toHaveAttribute("title");
      expect(button).toHaveAttribute("aria-label");
    });
  });

  it("updates pagination info correctly for different pages", () => {
    const { rerender } = render(<Pagination {...defaultProps} currentPage={2} startIndex={11} endIndex={20} />);
    
    expect(screen.getByText("Showing 11 to 20 of 50 results")).toBeInTheDocument();
    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
    
    rerender(<Pagination {...defaultProps} currentPage={5} startIndex={41} endIndex={50} />);
    
    expect(screen.getByText("Showing 41 to 50 of 50 results")).toBeInTheDocument();
    expect(screen.getByText("Page 5 of 5")).toBeInTheDocument();
  });
});
