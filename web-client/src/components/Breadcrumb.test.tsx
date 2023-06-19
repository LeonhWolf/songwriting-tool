import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { paths, router } from "../router";
import i18next from "../i18n/index";
import {
  getRouter,
  TestRouter,
  additionalPaths,
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
    render(<TestRouter initialPath={paths.home.path} />);
    expect(screen.getByTestId("home-breadcrumb")).toBeDefined();
  });
  it("Should render child route.", () => {
    render(<TestRouter initialPath={paths.dailyExercise.path} />);
    expect(screen.getByTestId("home-breadcrumb")).toBeDefined();

    const dailyExerciseBreadcrumbText = i18next.t("navItems.dailyExercise");
    expect(screen.getByText(dailyExerciseBreadcrumbText)).toBeDefined();
  });
  it("Should render nested child route.", () => {
    render(<TestRouter initialPath={additionalPaths.nestedSecondLevel.path} />);
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
  jest
    .spyOn(router, "routes", "get")
    .mockReturnValue(getRouter(paths.home.path).routes);

  it("Should not navigate to active route.", () => {
    render(<TestRouter initialPath={additionalPaths.nestedFirstLevel.path} />);
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
    render(<TestRouter initialPath={paths.home.path} />);
    const homeBreadcrumb = screen.getByTestId("home-breadcrumb");
    expect(homeBreadcrumb).toBeDefined();

    expect(mockUseNavigate).toHaveBeenCalledTimes(0);
    homeBreadcrumb.click();
    expect(mockUseNavigate).toHaveBeenCalledTimes(0);
  });
  it("Should navigate to parent route.", () => {
    render(<TestRouter initialPath={additionalPaths.nestedSecondLevel.path} />);

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
    render(<TestRouter initialPath={additionalPaths.nestedThirdLevel.path} />);
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
    render(<TestRouter initialPath={additionalPaths.nestedThirdLevel.path} />);
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
