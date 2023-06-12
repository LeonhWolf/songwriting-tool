import { screen, fireEvent } from "@testing-library/react";
import { createMemoryRouter } from "react-router";

import { paths } from "../navigation/router";
import type { Path } from "../navigation/router";

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

export const getRouter = (
  initialPath: string,
  additionalPaths?: Path[],
  replaceRouteElements?: React.ReactElement
): ReturnType<typeof createMemoryRouter> => {
  let testRoutes = (Object.keys(paths) as Array<keyof typeof paths>).map(
    (key) => paths[key]
  );

  if (additionalPaths !== undefined) testRoutes.push(...additionalPaths);
  if (replaceRouteElements !== undefined)
    testRoutes.forEach((route, index) => {
      testRoutes[index].element = replaceRouteElements;
    });

  const initialRouteIndex = testRoutes.findIndex(
    (route) => route.path === initialPath
  );
  if (initialRouteIndex === -1)
    throw new Error(
      `The path "${initialPath}" could not be found on the routes array.`
    );

  const testRouter = createMemoryRouter(testRoutes, {
    initialEntries: testRoutes.map((route) => route.path ?? ""),
    initialIndex: initialRouteIndex,
  });
  return testRouter;
};
