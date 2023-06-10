import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RouterProvider } from "react-router-dom";

import { paths, router } from "../navigation/router";
import i18next from "../i18n/index";
import {
  getRouter,
  additionalPaths,
  testRoutes,
} from "./Breadcrumb.test.helper";

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  return {
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockUseNavigate,
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Render:", () => {
  it("Should render home.", () => {
    const router = getRouter(paths.home.path);
    render(<RouterProvider router={router} />);
    expect(screen.getByTestId("home-breadcrumb")).toBeDefined();
  });
  it("Should render child route.", () => {
    const router = getRouter(paths.dailyExercise.path);
    render(<RouterProvider router={router} />);
    expect(screen.getByTestId("home-breadcrumb")).toBeDefined();

    const dailyExerciseBreadcrumbText = i18next.t("navItems.dailyExercise");
    expect(screen.getByText(dailyExerciseBreadcrumbText)).toBeDefined();
  });
  it("Should render nested child route.", () => {
    const router = getRouter(additionalPaths.nestedSecondLevel.path);
    render(<RouterProvider router={router} />);
    expect(screen.getByTestId("home-breadcrumb")).toBeDefined();

    const nestedFirstLevelBreadcrumbText = i18next.t(
      "navItems.nestedFirstLevel"
    );
    expect(screen.getByText(nestedFirstLevelBreadcrumbText)).toBeDefined();

    const nestedSecondLevelBreadcrumbText = i18next.t(
      "navItems.nestedSecondLevel"
    );
    expect(screen.getByText(nestedSecondLevelBreadcrumbText)).toBeDefined();
  });
});

describe("Navigate on click:", () => {
  //@ts-ignore
  jest.spyOn(router, "routes", "get").mockReturnValue(testRoutes);

  it("Should not navigate to active route.", () => {
    const testRouter = getRouter(additionalPaths.nestedFirstLevel.path);
    render(<RouterProvider router={testRouter} />);
    const nestedFirstLevelBreadcrumbText = i18next.t(
      "navItems.nestedFirstLevel"
    );
    const nestedFirstLevelBreadcrumb = screen.getByText(
      nestedFirstLevelBreadcrumbText
    );
    expect(nestedFirstLevelBreadcrumb).toBeDefined();
    expect(mockUseNavigate).toHaveBeenCalledTimes(0);
    nestedFirstLevelBreadcrumb.click();
    expect(mockUseNavigate).toHaveBeenCalledTimes(0);
  });
  it("Should not navigate 'home' when already on 'home'.", () => {
    const testRouter = getRouter(paths.home.path);
    render(<RouterProvider router={testRouter} />);
    const homeBreadcrumb = screen.getByTestId("home-breadcrumb");
    expect(homeBreadcrumb).toBeDefined();

    expect(mockUseNavigate).toHaveBeenCalledTimes(0);
    homeBreadcrumb.click();
    expect(mockUseNavigate).toHaveBeenCalledTimes(0);
  });
  it("Should navigate to parent route.", () => {
    const testRouter = getRouter(additionalPaths.nestedSecondLevel.path);
    render(<RouterProvider router={testRouter} />);
    const nestedSecondLevelBreadcrumb = screen.getByText(
      "navItems.nestedSecondLevel"
    );
    expect(nestedSecondLevelBreadcrumb).toBeDefined();

    const nestedFirstLevelBreadcrumb = screen.getByText(
      "navItems.nestedFirstLevel"
    );
    expect(mockUseNavigate).toHaveBeenCalledTimes(0);
    nestedFirstLevelBreadcrumb.click();
    expect(mockUseNavigate).toHaveBeenCalledTimes(1);
    expect(mockUseNavigate).toHaveBeenCalledWith(
      additionalPaths.nestedFirstLevel.path
    );
  });
  it("Should navigate to route above parent route.", () => {
    const testRouter = getRouter(additionalPaths.nestedThirdLevel.path);
    render(<RouterProvider router={testRouter} />);
    const nestedThirdLevelBreadcrumb = screen.getByText(
      "navItems.nestedThirdLevel"
    );
    expect(nestedThirdLevelBreadcrumb).toBeDefined();

    const nestedFirstLevelBreadcrumb = screen.getByText(
      "navItems.nestedFirstLevel"
    );
    expect(mockUseNavigate).toHaveBeenCalledTimes(0);
    nestedFirstLevelBreadcrumb.click();
    expect(mockUseNavigate).toHaveBeenCalledTimes(1);
    expect(mockUseNavigate).toHaveBeenCalledWith(
      additionalPaths.nestedFirstLevel.path
    );
  });
  it("Should navigate to home.", () => {
    const testRouter = getRouter(additionalPaths.nestedThirdLevel.path);
    render(<RouterProvider router={testRouter} />);
    const nestedThirdLevelBreadcrumb = screen.getByText(
      "navItems.nestedThirdLevel"
    );
    expect(nestedThirdLevelBreadcrumb).toBeDefined();

    const homeBreadcrumb = screen.getByTestId("home-breadcrumb");
    expect(mockUseNavigate).toHaveBeenCalledTimes(0);
    homeBreadcrumb.click();
    expect(mockUseNavigate).toHaveBeenCalledTimes(1);
    expect(mockUseNavigate).toHaveBeenCalledWith(paths.home.path);
  });
});
