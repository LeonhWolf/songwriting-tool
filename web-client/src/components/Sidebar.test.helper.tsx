import { useRef } from "react";
import { render, screen, act } from "@testing-library/react";
import { RouterProvider } from "react-router-dom";
import { getRouter } from "../utilities/testUtils";

import i18next from "../i18n";
import { paths } from "../router";

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

export const runTests = (pathToTest: string) => {
  it("Should render app title.", () => {
    const appTitle = i18next.t("global.appTitle");
    render(<RouterWrapper initialPath={pathToTest} />);
    expect(screen.getByText(appTitle)).toBeDefined();
    // expect(screen.getByTestId("sidebar-item-app-title")).toBeDefined();
  });
  if (pathToTest !== paths.home.path) {
    it("Should navigate to '/' on app title click.", () => {
      const locationSpy = jest.fn();
      render(
        <RouterWrapper initialPath={pathToTest} locationSpy={locationSpy} />
      );

      const appTitleText = i18next.t("global.appTitle");
      const appTitleElement = screen.getByText(appTitleText);

      expect(locationSpy).toHaveBeenCalledTimes(1);
      expect(locationSpy).toHaveBeenCalledWith(pathToTest);
      locationSpy.mockClear();

      act(() => {
        appTitleElement.click();
      });
      expect(locationSpy).toHaveBeenCalledTimes(1);
      expect(locationSpy).toHaveBeenCalledWith(paths.home.path);
    });
  }
  if (pathToTest === paths.home.path) {
    it("Should not navigate to already active route.", () => {
      const locationSpy = jest.fn();
      render(
        <RouterWrapper initialPath={pathToTest} locationSpy={locationSpy} />
      );

      const appTitleText = i18next.t("global.appTitle");
      const appTitleElement = screen.getByText(appTitleText);

      expect(locationSpy).toHaveBeenCalledTimes(1);
      expect(locationSpy).toHaveBeenCalledWith(paths.home.path);
      locationSpy.mockClear();

      act(() => {
        appTitleElement.click();
      });
      expect(locationSpy).toHaveBeenCalledTimes(0);
    });
  }

  describe("Daily Exercise:", () => {
    it("Should render.", () => {
      const dailyExerciseText = i18next.t("navItems.dailyExercise");
      render(<RouterWrapper initialPath={pathToTest} />);
      const navItemDailyExercise = screen.getByTestId(
        "sidebar-item-daily-exercise"
      );
      expect(navItemDailyExercise).toBeDefined();
      expect(navItemDailyExercise.textContent).toBe(dailyExerciseText);
    });
    if (pathToTest !== paths.dailyExercise.path) {
      it("Should navigate to proper route on click.", () => {
        const locationSpy = jest.fn();
        render(
          <RouterWrapper initialPath={pathToTest} locationSpy={locationSpy} />
        );

        const navItemDailyExercise = screen.getByTestId(
          "sidebar-item-daily-exercise"
        );

        expect(locationSpy).toHaveBeenCalledTimes(1);
        expect(locationSpy).toHaveBeenCalledWith(pathToTest);
        locationSpy.mockClear();

        act(() => {
          navItemDailyExercise.click();
        });
        expect(locationSpy).toHaveBeenCalledTimes(1);
        expect(locationSpy).toHaveBeenCalledWith(paths.dailyExercise.path);
      });
    }
    if (pathToTest === paths.dailyExercise.path) {
      it("Should not navigate to already active route.", () => {
        const locationSpy = jest.fn();
        render(
          <RouterWrapper initialPath={pathToTest} locationSpy={locationSpy} />
        );

        const navItemDailyExercise = screen.getByTestId(
          "sidebar-item-daily-exercise"
        );

        expect(locationSpy).toHaveBeenCalledTimes(1);
        expect(locationSpy).toHaveBeenCalledWith(paths.dailyExercise.path);
        locationSpy.mockClear();

        act(() => {
          navItemDailyExercise.click();
        });
        expect(locationSpy).toHaveBeenCalledTimes(0);
      });
    }
  });
  describe("Archive:", () => {
    it("Should render.", () => {
      const archiveText = i18next.t("navItems.archive");
      render(<RouterWrapper initialPath={pathToTest} />);
      const navItemArchive = screen.getByTestId("sidebar-item-archive");
      expect(navItemArchive).toBeDefined();
      expect(navItemArchive.textContent).toBe(archiveText);
    });
    if (pathToTest !== paths.archive.path) {
      it("Should navigate to proper route on click.", () => {
        const locationSpy = jest.fn();
        render(
          <RouterWrapper initialPath={pathToTest} locationSpy={locationSpy} />
        );

        const navItemArchive = screen.getByTestId("sidebar-item-archive");

        expect(locationSpy).toHaveBeenCalledTimes(1);
        expect(locationSpy).toHaveBeenCalledWith(pathToTest);
        locationSpy.mockClear();

        act(() => {
          navItemArchive.click();
        });
        expect(locationSpy).toHaveBeenCalledTimes(1);
        expect(locationSpy).toHaveBeenCalledWith(paths.archive.path);
      });
    }
    if (pathToTest === paths.archive.path) {
      it("Should not navigate to already active route.", () => {
        const locationSpy = jest.fn();
        render(
          <RouterWrapper initialPath={pathToTest} locationSpy={locationSpy} />
        );

        const navItemArchive = screen.getByTestId("sidebar-item-archive");

        expect(locationSpy).toHaveBeenCalledTimes(1);
        expect(locationSpy).toHaveBeenCalledWith(paths.archive.path);
        locationSpy.mockClear();

        act(() => {
          navItemArchive.click();
        });
        expect(locationSpy).toHaveBeenCalledTimes(0);
      });
    }
  });
  describe("Settings:", () => {
    it("Should render parent 'Settings'.", () => {
      const parentSettingsText = i18next.t("sidebar.settings.parent");
      render(<RouterWrapper initialPath={pathToTest} />);
      expect(screen.getByText(parentSettingsText)).toBeDefined();
    });
    it("Should render child 'Exercises'.", () => {
      const exerciseSettingsText = i18next.t("sidebar.settings.exercise");
      render(<RouterWrapper initialPath={pathToTest} />);
      const navItemExerciseSettings = screen.getByTestId(
        "sidebar-item-exercise-settings"
      );
      expect(navItemExerciseSettings).toBeDefined();
      expect(navItemExerciseSettings.textContent).toBe(exerciseSettingsText);
    });
    it("Should render child 'User'.", () => {
      const userSettingsText = i18next.t("sidebar.settings.user");
      render(<RouterWrapper initialPath={pathToTest} />);
      const navItemUserSettings = screen.getByTestId(
        "sidebar-item-user-settings"
      );
      expect(navItemUserSettings).toBeDefined();
      expect(navItemUserSettings.textContent).toBe(userSettingsText);
    });
    if (pathToTest !== paths.exerciseSettings.path) {
      it("Should navigate to 'exercise settings' on click.", () => {
        const locationSpy = jest.fn();
        render(
          <RouterWrapper initialPath={pathToTest} locationSpy={locationSpy} />
        );

        const navItemExerciseSettings = screen.getByTestId(
          "sidebar-item-exercise-settings"
        );

        expect(locationSpy).toHaveBeenCalledTimes(1);
        expect(locationSpy).toHaveBeenCalledWith(pathToTest);
        locationSpy.mockClear();

        act(() => {
          navItemExerciseSettings.click();
        });
        expect(locationSpy).toHaveBeenCalledTimes(1);
        expect(locationSpy).toHaveBeenCalledWith(paths.exerciseSettings.path);
      });
    }
    if (pathToTest === paths.exerciseSettings.path) {
      it("Should not navigate to already active route 'exercise settings'.", () => {
        const locationSpy = jest.fn();
        render(
          <RouterWrapper initialPath={pathToTest} locationSpy={locationSpy} />
        );

        const navItemExerciseSettings = screen.getByTestId(
          "sidebar-item-exercise-settings"
        );

        expect(locationSpy).toHaveBeenCalledTimes(1);
        expect(locationSpy).toHaveBeenCalledWith(paths.exerciseSettings.path);
        locationSpy.mockClear();

        act(() => {
          navItemExerciseSettings.click();
        });
        expect(locationSpy).toHaveBeenCalledTimes(0);
      });
    }

    if (pathToTest !== paths.userSettings.path) {
      it("Should navigate to 'user settings' on click.", () => {
        const locationSpy = jest.fn();
        render(
          <RouterWrapper initialPath={pathToTest} locationSpy={locationSpy} />
        );

        const navItemUserSettings = screen.getByTestId(
          "sidebar-item-user-settings"
        );

        expect(locationSpy).toHaveBeenCalledTimes(1);
        expect(locationSpy).toHaveBeenCalledWith(pathToTest);
        locationSpy.mockClear();

        act(() => {
          navItemUserSettings.click();
        });
        expect(locationSpy).toHaveBeenCalledTimes(1);
        expect(locationSpy).toHaveBeenCalledWith(paths.userSettings.path);
      });
    }
    if (pathToTest === paths.userSettings.path) {
      it("Should not navigate to already active route 'user settings'.", () => {
        const locationSpy = jest.fn();
        render(
          <RouterWrapper initialPath={pathToTest} locationSpy={locationSpy} />
        );

        const navItemUserSettings = screen.getByTestId(
          "sidebar-item-user-settings"
        );

        expect(locationSpy).toHaveBeenCalledTimes(1);
        expect(locationSpy).toHaveBeenCalledWith(paths.userSettings.path);
        locationSpy.mockClear();

        act(() => {
          navItemUserSettings.click();
        });
        expect(locationSpy).toHaveBeenCalledTimes(0);
      });
    }
  });
};
