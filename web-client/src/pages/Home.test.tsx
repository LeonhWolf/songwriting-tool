import { render, screen, act } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

import Home from "./Home";
import i18next from "../i18n";
import { paths } from "../navigation/router";

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate,
}));
const history = createMemoryHistory();
history.push = jest.fn();

const renderComponent = (): void => {
  render(
    <Router location={history.location} navigator={history}>
      <Home />
    </Router>
  );
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
      expect(history.push).toHaveBeenCalledTimes(0);

      act(() => {
        dailyExerciseTile.click();
      });
      expect(history.push).toHaveBeenCalledTimes(1);
      const historyPushArguments = (
        history.push as jest.MockedFunction<typeof history.push>
      ).mock.calls[0][0];
      //@ts-ignore
      const pathname = historyPushArguments.pathname;
      expect(pathname).toBe(`${paths.dailyExercise.path}`);
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
      expect(history.push).toHaveBeenCalledTimes(0);

      act(() => {
        archiveTile.click();
      });
      expect(history.push).toHaveBeenCalledTimes(1);
      const historyPushArguments = (
        history.push as jest.MockedFunction<typeof history.push>
      ).mock.calls[0][0];
      //@ts-ignore
      const pathname = historyPushArguments.pathname;
      expect(pathname).toBe(`${paths.archive.path}`);
    });
  });
});
