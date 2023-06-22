import { render, screen, act } from "@testing-library/react";
import { RouterProvider } from "react-router-dom";
import { useRef } from "react";

import i18next from "../i18n";
import { paths } from "../router";
import { getRouter } from "../utilities/testUtils";
import { runTests as runSidebarTests } from "../components/Sidebar.test.helper";

// Without it the mobile Offcanvas leads to having each sidebar nav item twice on the page.
jest.mock("../components/Offcanvas.tsx", () => () => {
  <div></div>;
});

interface RouterWrapperProps {
  initialPath: string;
  locationSpy?: (argument: string) => void;
}
const RouterWrapper = (props: RouterWrapperProps) => {
  const router = useRef(
    getRouter(props.initialPath, [], undefined, props.locationSpy)
  );

  return <RouterProvider router={router.current} />;
};

beforeEach(() => {
  jest.clearAllMocks();
});

it("Should render page title.", () => {
  render(<RouterWrapper initialPath={paths.home.path} />);
  const homeTitle = i18next.t("home.title");
  expect(screen.getByText(homeTitle)).toBeDefined();
});

describe("Breadcrumbs:", () => {
  it("Should render 'home'.", () => {
    render(<RouterWrapper initialPath={paths.home.path} />);
    expect(screen.getByTestId("home-breadcrumb")).toBeDefined();
  });
  it("Should not change navigation when clicking on 'home'.", () => {
    const locationSpy = jest.fn();
    render(
      <RouterWrapper initialPath={paths.home.path} locationSpy={locationSpy} />
    );
    locationSpy.mockClear();
    const homeLink = screen.getByTestId("home-breadcrumb");
    expect(locationSpy).toHaveBeenCalledTimes(0);

    homeLink.click();
    expect(locationSpy).toHaveBeenCalledTimes(0);
  });
});

describe("Tiles:", () => {
  describe("Daily Exercise:", () => {
    it("Should display 'daily exercise'.", () => {
      render(<RouterWrapper initialPath={paths.home.path} />);
      const dailyExerciseTitle = i18next.t("home.tiles.dailyExercise");
      expect(screen.getByText(dailyExerciseTitle)).toBeDefined();
    });
    it("Should navigate to 'daily exercise' on click.", () => {
      const locationSpy = jest.fn();
      render(
        <RouterWrapper
          initialPath={paths.home.path}
          locationSpy={locationSpy}
        />
      );
      locationSpy.mockClear();
      const dailyExerciseTitle = i18next.t("home.tiles.dailyExercise");
      const dailyExerciseTile = screen.getByText(dailyExerciseTitle);

      expect(locationSpy).toHaveBeenCalledTimes(0);
      act(() => {
        dailyExerciseTile.click();
      });

      expect(locationSpy).toHaveBeenCalledTimes(1);
      expect(locationSpy).toHaveBeenCalledWith(paths.dailyExercise.path);
    });
  });
  describe("Archive:", () => {
    it("Should display 'archive'.", () => {
      render(<RouterWrapper initialPath={paths.home.path} />);
      const archiveTitle = i18next.t("home.tiles.archive");
      const tileArchive = screen.getByTestId("tile-archive");
      expect(tileArchive).toBeDefined();
      expect(tileArchive.textContent).toBe(archiveTitle);
    });
    it("Should navigate to 'archive' on click.", () => {
      const locationSpy = jest.fn();
      render(
        <RouterWrapper
          initialPath={paths.home.path}
          locationSpy={locationSpy}
        />
      );
      locationSpy.mockClear();
      const tileArchive = screen.getByTestId("tile-archive");

      expect(locationSpy).toHaveBeenCalledTimes(0);
      act(() => {
        tileArchive.click();
      });

      expect(locationSpy).toHaveBeenCalledTimes(1);
      expect(locationSpy).toHaveBeenCalledWith(paths.archive.path);
    });
  });
});

describe("Sidebar Desktop:", () => {
  runSidebarTests(paths.home.path);
});

// describe("Sidebar Mobile:", () => {
//   // https://stackoverflow.com/questions/45868042/figuring-out-how-to-mock-the-window-size-changing-for-a-react-component-test
//   it.todo("Should render everything on mobile.");
// });
