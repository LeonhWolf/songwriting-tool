import { createMemoryRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";

import Breadcrumb from "./Breadcrumb";
import { paths } from "../navigation/router";
import type { RouterPaths, Path } from "../navigation/router";

const testPaths: Pick<RouterPaths, "home" | "dailyExercise"> = {
  home: {
    ...paths.home,
    element: <Breadcrumb />,
  },
  dailyExercise: {
    ...paths.dailyExercise,
    element: <Breadcrumb />,
  },
};
interface AdditionalPaths {
  nestedFirstLevel: Path;
  nestedSecondLevel: Path;
  nestedThirdLevel: Path;
}
export const additionalPaths: AdditionalPaths = {
  nestedFirstLevel: {
    path: "/nested-first-level",
    element: <Breadcrumb />,
    handle: {
      translationKeys: ["nestedFirstLevel"],
    },
  },
  nestedSecondLevel: {
    path: "/nested-second-level",
    element: <Breadcrumb />,
    handle: {
      translationKeys: ["nestedFirstLevel", "nestedSecondLevel"],
    },
  },
  nestedThirdLevel: {
    path: "/nested-third-level",
    element: <Breadcrumb />,
    handle: {
      translationKeys: [
        "nestedFirstLevel",
        "nestedSecondLevel",
        "nestedThirdLevel",
      ],
    },
  },
};
export const testRoutes: RouteObject[] = [
  testPaths.home,
  testPaths.dailyExercise,
  additionalPaths.nestedFirstLevel,
  additionalPaths.nestedSecondLevel,
  additionalPaths.nestedThirdLevel,
];

export const getRouter = (
  initialPath: string
): ReturnType<typeof createMemoryRouter> => {
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
