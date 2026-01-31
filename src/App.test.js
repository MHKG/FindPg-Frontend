/* global test, expect */
import { render, screen } from "@testing-library/react";
import HomePage from "./HomePage";

test("renders home page heading", () => {
  render(<HomePage />);
  const heading = screen.getByText(/Find your best stay/i);

  expect(heading).toBeInTheDocument();
});
