import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

import { paths } from "../router";
import type { Paths } from "../router";
import css from "./Sidebar.module.scss";
import Collapse from "./Collapse";
import { ReactComponent as ChevronUpSVG } from "../assets/SVGs/chevron-up.svg";

interface NavItemProps {
  text: string;
  url: string;
  className?: string;
  dataTestId?: string;
  onItemClick: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    url: string
  ) => void;
}
const NavItem = (props: NavItemProps) => {
  return (
    <a
      className={props.className}
      href={props.url}
      data-testid={props.dataTestId}
      onClick={(event) => {
        props.onItemClick(event, props.url);
      }}
    >
      {props.text}
    </a>
  );
};

interface NavItemActivity {
  isActive: boolean;
}
interface NavItemsActivity
  extends Pick<
    Paths<NavItemActivity>,
    "dailyExercise" | "archive" | "exerciseSettings" | "userSettings"
  > {}

const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSettingsGroupOpen, setIsSettingsGroupOpen] =
    useState<boolean>(false);
  const [navItemsActivity, setNavItemsActivity] = useState<NavItemsActivity>({
    dailyExercise: { isActive: false },
    archive: { isActive: false },
    exerciseSettings: { isActive: false },
    userSettings: { isActive: false },
  });

  const handleLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    url: string
  ) => {
    event.preventDefault();
    const currentPath = location.pathname;
    if (currentPath === url) return;
    navigate(url);
  };

  const updateIsSettingsGroupOpen = (currentLocation: string) => {
    if (
      currentLocation === paths.exerciseSettings.path ||
      currentLocation === paths.userSettings.path
    ) {
      setIsSettingsGroupOpen(true);
    }
  };

  const updateNavItemsActivity = (currentLocation: string) => {
    const newNavItemsActivity: NavItemsActivity = {
      dailyExercise: { isActive: false },
      archive: { isActive: false },
      exerciseSettings: { isActive: false },
      userSettings: { isActive: false },
    };
    (Object.keys(navItemsActivity) as Array<keyof NavItemsActivity>).forEach(
      (navItemKey) => {
        if (currentLocation === paths[navItemKey].path) {
          newNavItemsActivity[navItemKey].isActive = true;
        }
      }
    );

    setNavItemsActivity(newNavItemsActivity);
  };

  useEffect(() => {
    const currentLocation = location.pathname;
    updateIsSettingsGroupOpen(currentLocation);
    updateNavItemsActivity(currentLocation);
  }, [location]);

  return (
    <nav>
      <NavItem
        className={css["nav-text"]}
        text={t("global.appTitle")}
        url={paths.home.path}
        onItemClick={(event, url) => handleLinkClick(event, url)}
      />
      <ul className="ps-0">
        <li className={css["nav-item"]}>
          <NavItem
            className={`${css["nav-text"]} ${
              navItemsActivity.dailyExercise.isActive ? css["is-active"] : ""
            }`}
            text={t("navItems.dailyExercise")}
            url={paths.dailyExercise.path}
            dataTestId="sidebar-item-daily-exercise"
            onItemClick={(event, url) => handleLinkClick(event, url)}
          />
        </li>
        <li className={css["nav-item"]}>
          <NavItem
            className={`${css["nav-text"]} ${
              navItemsActivity.archive.isActive ? css["is-active"] : ""
            }`}
            text={t("navItems.archive")}
            url={paths.archive.path}
            dataTestId="sidebar-item-archive"
            onItemClick={(event, url) => handleLinkClick(event, url)}
          />
        </li>
        <li className={css["nav-item"]}>
          <div
            className={`${css["nav-item-group"]} ${
              isSettingsGroupOpen ? css["is-open"] : ""
            }`}
            onClick={() => {
              setIsSettingsGroupOpen(!isSettingsGroupOpen);
            }}
          >
            <ChevronUpSVG className={css["collapse-indicator"]} />
            <div className={css["nav-text"]}>
              {t("sidebar.settings.parent")}
            </div>
          </div>

          <Collapse doShow={isSettingsGroupOpen}>
            <div className="d-flex flex-column" style={{ marginLeft: "30px" }}>
              <NavItem
                className={
                  navItemsActivity.exerciseSettings.isActive
                    ? css["is-active"]
                    : ""
                }
                text={t("sidebar.settings.exercise")}
                url={paths.exerciseSettings.path}
                dataTestId="sidebar-item-exercise-settings"
                onItemClick={(event, url) => handleLinkClick(event, url)}
              />
              <NavItem
                className={
                  navItemsActivity.userSettings.isActive ? css["is-active"] : ""
                }
                text={t("sidebar.settings.user")}
                url={paths.userSettings.path}
                dataTestId="sidebar-item-user-settings"
                onItemClick={(event, url) => handleLinkClick(event, url)}
              />
            </div>
          </Collapse>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
