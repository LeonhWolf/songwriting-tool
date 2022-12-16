import { screen, fireEvent } from "@testing-library/react";

export async function flushPendingPromises(): Promise<void> {
  await new Promise((resolve) => {
    process.nextTick(resolve);
  });
}

export const setInputValue = (
  placeholderText: string,
  value: string
): HTMLInputElement => {
  const inputElement = screen.getByPlaceholderText(
    placeholderText
  ) as HTMLInputElement;
  fireEvent.change(inputElement, {
    target: { value },
  });
  expect(inputElement.value).toBe(value);
  return inputElement;
};
