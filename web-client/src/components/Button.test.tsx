import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Button from "./Button";

it("Should render button text.", () => {
  render(<Button text="testText" onClick={() => {}} />);
  const buttonElement = screen.getByRole("button");
  expect(buttonElement.textContent).toBe("testText");
});
it("Should not emit clicked event when not clicked.", () => {
  const clickSpy = jest.fn();
  render(<Button text="testText" onClick={clickSpy} />);
  expect(clickSpy).toHaveBeenCalledTimes(0);
});
it("Should emit clicked event when clicked.", () => {
  const clickSpy = jest.fn();
  render(<Button text="testText" onClick={clickSpy} />);
  const buttonElement = screen.getByRole("button");
  buttonElement.click();
  expect(clickSpy).toHaveBeenCalledTimes(1);
});
