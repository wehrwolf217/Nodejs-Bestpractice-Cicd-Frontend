import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

test("renders button with text and responds to click", () => {
  const handleClick = jest.fn();
  render(<Button text="Click me" onClick={handleClick} />);

  const button = screen.getByText("Click me");
  expect(button).toBeInTheDocument();

  fireEvent.click(button);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
