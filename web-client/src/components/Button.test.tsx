import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Button from "./Button";

it("Should render button text.", () => {
  render(<Button text="testText" isDisabled={false} onClick={() => {}} />);
  const buttonElement = screen.getByRole("button");
  expect(buttonElement.textContent).toBe("testText");
});
it("Should not emit clicked event when not clicked.", () => {
  const clickSpy = jest.fn();
  render(<Button text="testText" isDisabled={false} onClick={clickSpy} />);
  expect(clickSpy).toHaveBeenCalledTimes(0);
});
it("Should emit clicked event when clicked.", () => {
  const clickSpy = jest.fn();
  render(<Button text="testText" isDisabled={false} onClick={clickSpy} />);
  const buttonElement = screen.getByRole("button");
  buttonElement.click();
  expect(clickSpy).toHaveBeenCalledTimes(1);
});
it("Should disable button.", () => {
  render(<Button text="testText" isDisabled={false} onClick={() => {}} />);
  const buttonElement = screen.getByText<HTMLButtonElement>("testText");
  expect(buttonElement.disabled).toBe(false);
});
it("Should not disable button.", () => {
  render(<Button text="testText" isDisabled={true} onClick={() => {}} />);
  const buttonElement = screen.getByText<HTMLButtonElement>("testText");
  expect(buttonElement.disabled).toBe(true);
});
