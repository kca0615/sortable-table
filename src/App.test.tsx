import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("main page", () => {
  it("renders page heading", async () => {
    render(<App />);
    const heading = await screen.findByRole("heading", { name: "World Cities Database" });
    expect(heading).toBeInTheDocument();
  });

  it("does a search correctly", async () => {
    render(<App />);
    expect(await screen.findAllByText(/Tokyo/)).toHaveLength(2); // Table and mobile card
    const textInput = screen.getByRole("textbox");
    userEvent.type(textInput, "osaka");
    expect(screen.queryByText(/Tokyo/)).not.toBeInTheDocument();
  });
});
