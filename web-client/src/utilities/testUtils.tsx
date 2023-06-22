import { screen, fireEvent } from "@testing-library/react";
import { createMemoryRouter } from "react-router";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cloneDeep } from "lodash";

import { paths } from "../router";
import type { Path } from "../router";

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

const ElementWrapper = (props: {
  children: React.ReactElement;
  onRouteChange: (newRoute: string) => void;
}) => {
  const location = useLocation();

  useEffect(() => {
    props.onRouteChange(location.pathname);
  }, [location]);

  return props.children;
};
export const getRouter = (
  initialPath: string,
  additionalPaths?: Path[],
  elementToReplaceInRoutes?: React.ReactElement,
  onRouteChange?: (newRoute: string) => void
): ReturnType<typeof createMemoryRouter> => {
  let testRoutes = (Object.keys(paths) as Array<keyof typeof paths>).map(
    (key) => cloneDeep(paths[key])
  );

  if (additionalPaths !== undefined) testRoutes.push(...additionalPaths);
  if (elementToReplaceInRoutes !== undefined)
    testRoutes.forEach((route, index) => {
      testRoutes[index].element = elementToReplaceInRoutes;
    });

  if (onRouteChange !== undefined)
    testRoutes.forEach((route, index) => {
      testRoutes[index].element = (
        <ElementWrapper
          onRouteChange={(newRoute) => {
            onRouteChange(newRoute);
          }}
        >
          {testRoutes[index].element}
        </ElementWrapper>
      );
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
