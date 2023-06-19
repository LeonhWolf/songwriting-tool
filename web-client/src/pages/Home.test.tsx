import { render, screen } from "@testing-library/react";
import { RouterProvider } from "react-router-dom";

import i18next from "../i18n";
import Home from "./Home";
import { paths } from "../router";
import { getRouter } from "../utilities/testUtils";
import { runTests as runSidebarTests } from "../components/Sidebar.test.helper";

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
      const tileArchive = screen.getByTestId("tile-archive");
      expect(tileArchive).toBeDefined();
      expect(tileArchive.textContent).toBe(archiveTitle);
      // expect(screen.getByText(archiveTitle)).toBeDefined();
    });
    it("Should navigate to 'archive' on click.", () => {
      renderComponent();
      const tileArchive = screen.getByTestId("tile-archive");

      expect(mockUseNavigate).toHaveBeenCalledTimes(0);
      tileArchive.click();
      expect(mockUseNavigate).toHaveBeenCalledTimes(1);
      expect(mockUseNavigate).toHaveBeenCalledWith(paths.archive.path);
    });
  });
});

it.only("Test", () => {
  // renderComponent();
  const router = getRouter(paths.home.path);
  render(<RouterProvider router={router} />);
  expect(1).toBe(1);
});

describe("Sidebar Test:", () => {
  runSidebarTests(<Home />);
});

describe("Sidebar:", () => {
  // https://stackoverflow.com/questions/45868042/figuring-out-how-to-mock-the-window-size-changing-for-a-react-component-test
  it.todo("Should render everything on mobile.");
});
