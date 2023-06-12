import { useRef } from "react";
import { RouterProvider } from "react-router-dom";

import Breadcrumb from "./Breadcrumb";
import { getRouter as getTestRouter } from "../utils/testUtils";
import type { Path } from "../navigation/router";

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

export const getRouter = (initialPath: string) => {
  return getTestRouter(
    initialPath,
    [
      additionalPaths.nestedFirstLevel,
      additionalPaths.nestedSecondLevel,
      additionalPaths.nestedThirdLevel,
    ],
    <Breadcrumb />
  );
};

export const TestRouter = (props: { initialPath: string }) => {
  const router = useRef(getRouter(props.initialPath));
  return <RouterProvider router={router.current} />;
};
