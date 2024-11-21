import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders meal records", async () => {
  render(<App />);
  const meal = await screen.findByText(/Breakfast/i);
  expect(meal).toBeInTheDocument();
});
