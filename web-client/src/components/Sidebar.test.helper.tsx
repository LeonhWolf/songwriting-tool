import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { render, screen, act } from "@testing-library/react";
import { RouterProvider } from "react-router-dom";
import { getRouter } from "../utilities/testUtils";

import i18next from "../i18n";
import { paths } from "../router";

const SidebarWrapper = (props: {
  ElementToTest: React.ReactElement;
  onRouteChange: (newRoute: string) => void;
}) => {
  const location = useLocation();

  useEffect(() => {
    props.onRouteChange(location.pathname);
  }, [location]);

  return props.ElementToTest;
};

interface RouterWrapperProps {
  initialPath: string;
  ElementToTest: React.ReactElement;
  locationSpy: (argument: string) => void;
}
const RouterWrapper = (props: RouterWrapperProps) => {
  return (
    <RouterProvider
      router={getRouter(
        props.initialPath,
        [],
        <SidebarWrapper
          ElementToTest={props.ElementToTest}
          onRouteChange={(newRoute) => {
            props.locationSpy(newRoute);
          }}
        />
      )}
    />
  );
};

export const runTests = (ElementToTest: React.ReactElement) => {
  it.only("Should render app title.", () => {
    const appTitle = i18next.t("global.appTitle");
    render(
      <RouterWrapper
        ElementToTest={ElementToTest}
        initialPath={paths.dailyExercise.path}
        locationSpy={() => {}}
      />
    );
    expect(screen.getByText(appTitle)).toBeDefined();
  });
  it("Should navigate to '/' on app title click.", () => {
    const locationSpy = jest.fn();
    render(
      <RouterWrapper
        ElementToTest={ElementToTest}
        initialPath={paths.dailyExercise.path}
        locationSpy={locationSpy}
      />
    );

    const appTitleText = i18next.t("global.appTitle");
    const appTitleElement = screen.getByText(appTitleText);

    expect(locationSpy).toHaveBeenCalledTimes(1);
    expect(locationSpy).toHaveBeenCalledWith(paths.dailyExercise.path);
    locationSpy.mockClear();

    act(() => {
      appTitleElement.click();
    });
    expect(locationSpy).toHaveBeenCalledTimes(1);
    expect(locationSpy).toHaveBeenCalledWith(paths.home.path);
  });
  describe("Daily Exercise:", () => {
    it("Should render.", () => {
      const dailyExerciseText = i18next.t("navItems.dailyExercise");
      render(
        <RouterWrapper
          ElementToTest={ElementToTest}
          initialPath={paths.dailyExercise.path}
          locationSpy={() => {}}
        />
      );
      const navItemDailyExercise = screen.getByTestId(
        "sidebar-item-daily-exercise"
      );
      expect(navItemDailyExercise).toBeDefined();
      expect(navItemDailyExercise.textContent).toBe(dailyExerciseText);
    });
    it("Should navigate to proper route on click.", () => {
      const locationSpy = jest.fn();
      render(
        <RouterWrapper
          ElementToTest={ElementToTest}
          initialPath={paths.home.path}
          locationSpy={locationSpy}
        />
      );

      const navItemDailyExercise = screen.getByTestId(
        "sidebar-item-daily-exercise"
      );

      expect(locationSpy).toHaveBeenCalledTimes(1);
      expect(locationSpy).toHaveBeenCalledWith(paths.home.path);
      locationSpy.mockClear();

      act(() => {
        navItemDailyExercise.click();
      });
      expect(locationSpy).toHaveBeenCalledTimes(1);
      expect(locationSpy).toHaveBeenCalledWith(paths.dailyExercise.path);
    });
  });
  describe("Archive:", () => {
    it("Should render.", () => {
      const archiveText = i18next.t("navItems.archive");
      render(
        <RouterWrapper
          ElementToTest={ElementToTest}
          initialPath={paths.dailyExercise.path}
          locationSpy={() => {}}
        />
      );
      const navItemArchive = screen.getByTestId("sidebar-item-archive");
      expect(navItemArchive).toBeDefined();
      expect(navItemArchive.textContent).toBe(archiveText);
    });
    it("Should navigate to proper route on click.", () => {
      const locationSpy = jest.fn();
      render(
        <RouterWrapper
          ElementToTest={ElementToTest}
          initialPath={paths.home.path}
          locationSpy={locationSpy}
        />
      );

      const navItemArchive = screen.getByTestId("sidebar-item-archive");

      expect(locationSpy).toHaveBeenCalledTimes(1);
      expect(locationSpy).toHaveBeenCalledWith(paths.home.path);
      locationSpy.mockClear();

      act(() => {
        navItemArchive.click();
      });
      expect(locationSpy).toHaveBeenCalledTimes(1);
      expect(locationSpy).toHaveBeenCalledWith(paths.archive.path);
    });
  });
  describe("Settings:", () => {
    it("Should render parent 'Settings'.", () => {
      const parentSettingsText = i18next.t("sidebar.settings.parent");
      render(
        <RouterWrapper
          ElementToTest={ElementToTest}
          initialPath={paths.dailyExercise.path}
          locationSpy={() => {}}
        />
      );
      expect(screen.getByText(parentSettingsText)).toBeDefined();
    });
    it("Should render child 'Exercises'.", () => {
      const exerciseSettingsText = i18next.t("sidebar.settings.exercise");
      render(
        <RouterWrapper
          ElementToTest={ElementToTest}
          initialPath={paths.dailyExercise.path}
          locationSpy={() => {}}
        />
      );
      const navItemExerciseSettings = screen.getByTestId(
        "sidebar-item-exercise-settings"
      );
      expect(navItemExerciseSettings).toBeDefined();
      expect(navItemExerciseSettings.textContent).toBe(exerciseSettingsText);
    });
    it("Should render child 'User'.", () => {
      const userSettingsText = i18next.t("sidebar.settings.user");
      render(
        <RouterWrapper
          ElementToTest={ElementToTest}
          initialPath={paths.dailyExercise.path}
          locationSpy={() => {}}
        />
      );
      const navItemUserSettings = screen.getByTestId(
        "sidebar-item-user-settings"
      );
      expect(navItemUserSettings).toBeDefined();
      expect(navItemUserSettings.textContent).toBe(userSettingsText);
    });
    it("Should navigate to 'exercise settings' on click.", () => {
      const locationSpy = jest.fn();
      render(
        <RouterWrapper
          ElementToTest={ElementToTest}
          initialPath={paths.home.path}
          locationSpy={locationSpy}
        />
      );

      const navItemExerciseSettings = screen.getByTestId(
        "sidebar-item-exercise-settings"
      );

      expect(locationSpy).toHaveBeenCalledTimes(1);
      expect(locationSpy).toHaveBeenCalledWith(paths.home.path);
      locationSpy.mockClear();

      act(() => {
        navItemExerciseSettings.click();
      });
      expect(locationSpy).toHaveBeenCalledTimes(1);
      expect(locationSpy).toHaveBeenCalledWith(paths.exerciseSettings.path);
    });
    it("Should navigate to 'user settings' on click.", () => {
      const locationSpy = jest.fn();
      render(
        <RouterWrapper
          ElementToTest={ElementToTest}
          initialPath={paths.home.path}
          locationSpy={locationSpy}
        />
      );

      const navItemUserSettings = screen.getByTestId(
        "sidebar-item-user-settings"
      );

      expect(locationSpy).toHaveBeenCalledTimes(1);
      expect(locationSpy).toHaveBeenCalledWith(paths.home.path);
      locationSpy.mockClear();

      act(() => {
        navItemUserSettings.click();
      });
      expect(locationSpy).toHaveBeenCalledTimes(1);
      expect(locationSpy).toHaveBeenCalledWith(paths.userSettings.path);
    });
  });

  it("Should not navigate to already active route.", () => {
    const locationSpy = jest.fn();
    render(
      <RouterWrapper
        ElementToTest={ElementToTest}
        initialPath={paths.userSettings.path}
        locationSpy={locationSpy}
      />
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
};
