import { render, screen } from "@testing-library/react";
import { RouterProvider } from "react-router-dom";

import i18next from "../i18n";
import { paths } from "../navigation/router";
import { getRouter } from "../utils/testUtils";

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate,
}));

const renderComponent = (): void => {
  const router = getRouter(paths.home.path);
  render(<RouterProvider router={router} />);
};

beforeEach(() => {
  jest.clearAllMocks();
});

it("Should render page title.", () => {
  renderComponent();
  const homeTitle = i18next.t("home.title");
  expect(screen.getByText(homeTitle)).toBeDefined();
});

describe("Breadcrumbs:", () => {
  it("Should render 'home'.", () => {
    renderComponent();
    expect(screen.getByTestId("home-breadcrumb")).toBeDefined();
  });
  it("Should not change navigation when clicking on 'home'.", () => {
    renderComponent();
    const homeLink = screen.getByTestId("home-breadcrumb");
    expect(mockUseNavigate).toHaveBeenCalledTimes(0);

    homeLink.click();
    expect(mockUseNavigate).toHaveBeenCalledTimes(0);
  });
});

describe("Tiles:", () => {
  describe("Daily Exercise:", () => {
    it("Should display 'daily exercise'.", () => {
      renderComponent();
      const dailyExerciseTitle = i18next.t("home.tiles.dailyExercise");
      expect(screen.getByText(dailyExerciseTitle)).toBeDefined();
    });
    it("Should navigate to 'daily exercise' on click.", () => {
      renderComponent();
      const dailyExerciseTitle = i18next.t("home.tiles.dailyExercise");
      const dailyExerciseTile = screen.getByText(dailyExerciseTitle);

      expect(mockUseNavigate).toHaveBeenCalledTimes(0);
      dailyExerciseTile.click();
      expect(mockUseNavigate).toHaveBeenCalledTimes(1);
      expect(mockUseNavigate).toHaveBeenCalledWith(paths.dailyExercise.path);
    });
  });
  describe("Archive:", () => {
    it("Should display 'archive'.", () => {
      renderComponent();
      const archiveTitle = i18next.t("home.tiles.archive");
      expect(screen.getByText(archiveTitle)).toBeDefined();
    });
    it("Should navigate to 'archive' on click.", () => {
      renderComponent();
      const archiveTitle = i18next.t("home.tiles.archive");
      const archiveTile = screen.getByText(archiveTitle);

      expect(mockUseNavigate).toHaveBeenCalledTimes(0);
      archiveTile.click();
      expect(mockUseNavigate).toHaveBeenCalledTimes(1);
      expect(mockUseNavigate).toHaveBeenCalledWith(paths.archive.path);
    });
  });
});
