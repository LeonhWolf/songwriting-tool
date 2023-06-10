import { useEffect, useState } from "react";
import { useMatches, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { paths, router } from "../navigation/router";
import type { Path } from "../navigation/router";
import { ReactComponent as HouseSVG } from "../assets/SVGs/house-door.svg";
import css from "./Breadcrumb.module.scss";

interface BreadcrumbItem {
  key: string;
  translation: string;
}
const Breadcrumb = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const matches = useMatches();
  const { t } = useTranslation();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  const handleBreadcrumbClick = (translationKey: string): void => {
    const isClickedRouteHome = translationKey === "";
    if (isClickedRouteHome) {
      if (location.pathname === paths.home.path) return;
      const homeRoute = router.routes.find(
        (route) => route.path === paths.home.path
      );

      if (homeRoute === undefined || homeRoute.path === undefined)
        return console.error(
          "Could not navigate to 'home'. Its route could not be found."
        );
      navigate(homeRoute.path);
    }

    const clickedRoute = router.routes.find(
      (route) =>
        route.handle.translationKeys[
          route.handle.translationKeys.length - 1
        ] === translationKey
    );

    if (clickedRoute === undefined || clickedRoute.path === undefined) return;
    if (location.pathname === clickedRoute.path) return;
    navigate(clickedRoute.path);
  };

  const updateBreadcrumbsCurrentRoute = (): void => {
    const translationKeysCurrentRoute = (matches[0].handle as Path["handle"])[
      "translationKeys"
    ];
    const translatedBreadcrumbs = translationKeysCurrentRoute.map(
      (translationKey) => ({
        key: translationKey,
        translation: t(`navItems.${translationKey}`),
      })
    );
    const homeBreadcrumb = { key: "", translation: "" };
    translatedBreadcrumbs.unshift(homeBreadcrumb);

    setBreadcrumbs(translatedBreadcrumbs);
  };

  useEffect(() => {
    updateBreadcrumbsCurrentRoute();
  }, [matches, t]);

  return (
    <nav>
      <ol className={css["breadcrumb"]}>
        {breadcrumbs.map((breadcrumb, index) => {
          if (index === 0) {
            return (
              <li
                key={index}
                id={css["home-icon"]}
                className={`${css["breadcrumb-item"]} ${
                  breadcrumbs.length === 1 ? css["active"] : ""
                }`}
                data-testid="home-breadcrumb"
                onClick={() => handleBreadcrumbClick(breadcrumb.key)}
              >
                <a
                  href="/"
                  onClick={(event) => {
                    event.preventDefault();
                  }}
                >
                  <HouseSVG />
                </a>
              </li>
            );
          }

          return (
            <li
              key={index}
              className={`${css["breadcrumb-item"]} ${
                index === breadcrumbs.length - 1 && css["active"]
              } disabled`}
              onClick={() => handleBreadcrumbClick(breadcrumb.key)}
            >
              <a
                href="/"
                onClick={(event) => {
                  event.preventDefault();
                }}
              >
                {breadcrumb.translation}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
